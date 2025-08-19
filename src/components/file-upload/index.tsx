import React, { useState, useEffect } from "react";
import axios from "axios";

type MultiFileUploaderProps = {
  value?: string[]; // array of uploaded URLs
  onChange: (urls: string[]) => void;
  disabled?: boolean;
};

const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  value = [],
  onChange,
  disabled,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  // pilih file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
  };

  // upload file otomatis
  useEffect(() => {
    if (files.length === 0) return;

    const uploadNextFile = async () => {
      const file = files[0]; // ambil file pertama
      if (!file) return;

      setUploadingIndex(0);
      const token = localStorage.getItem("token");
      const urls: string[] = [...value];

      const formData = new FormData();
      formData.append("bucket", "approval-app");
      formData.append("key", `uploads/${file.name}`);
      formData.append("file", file);
      formData.append("contentType", file.type);
      formData.append("acl", "public-read");

      try {
        const res = await axios.post(
          "http://10.0.29.47:9007/s3/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const fileUrl = res.data?.data?.data?.url;
        console.log("File uploaded successfully:", fileUrl);

        if (fileUrl) {
          urls.push(fileUrl);
          onChange(urls);
        }
      } catch (err) {
        console.error("Upload gagal:", err);
        alert(`Upload gagal untuk ${file.name}`);
      } finally {
        // hapus file dari buffer setelah selesai
        setFiles((prev) => prev.slice(1));
        setUploadingIndex(null);
      }
    };

    uploadNextFile();
  }, [files]); // trigger setiap files berubah

  const handleRemove = async (index: number) => {
    const fileUrl = value[index];
    if (!fileUrl) return;

    setRemovingIndex(index);

    try {
      // Extract path dari URL
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const parts = pathname.split("/");
      const bucket = parts[1];
      const path = parts.slice(2).join("/");

      const token = localStorage.getItem("token");

      await axios.delete(`http://10.0.29.47:9007/s3/${bucket}/${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newUrls = value.filter((_, i) => i !== index);

      console.log("File removed successfully:", fileUrl);
      
      onChange(newUrls);
    } catch (err) {
      console.error("Gagal hapus file:", err);
      alert("Gagal hapus file dari S3");
    } finally {
      setRemovingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input select */}
      <label className="flex flex-col items-center justify-center w-full h-24 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
        <span className="text-gray-500">📎 Pilih file</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </label>

      {/* Daftar file yang sedang diupload */}
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              {f.name} ({(f.size / 1024).toFixed(1)} KB)
              {uploadingIndex === i && (
                <svg
                  className="animate-spin h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Daftar URL hasil upload */}
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((url, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 border rounded-md"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                {url.split("/").pop()}
              </a>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 flex items-center gap-2"
                onClick={() => handleRemove(index)}
                disabled={disabled || removingIndex === index}
              >
                {removingIndex === index ? (
                  <svg
                    className="animate-spin h-4 w-4 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "✕"
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiFileUploader;
