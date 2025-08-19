import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Paperclip,
    X,
    Image as ImageIcon,
    FileText,
    File as FileIcon,
    UploadCloud,
} from "lucide-react";

// --- Helpers ---
const bytesToReadable = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024,
        sizes = ["B", "KB", "MB", "GB", "TB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${value % 1 === 0 ? value : value.toFixed(1)} ${sizes[i]}`;
};

const fileIconByType = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" aria-hidden />;
    if (file.type.includes("pdf")) return <FileText className="w-4 h-4" aria-hidden />;
    return <FileIcon className="w-4 h-4" aria-hidden />;
};

const dedupeFiles = (list: File[]) => {
    const seen = new Set<string>();
    return list.filter((f) => {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

// --- Types ---
export type AttachmentInputProps = {
    value?: File[];
    onChange?: (files: File[]) => void;
    accept?: string;
    maxFiles?: number;
    maxFileSizeMB?: number;
    maxTotalSizeMB?: number;
    disabled?: boolean;
    name?: string;
    className?: string;
};

// --- Main Component ---
export function AttachmentInput({
    value,
    onChange,
    accept,
    maxFiles = 10,
    maxFileSizeMB = 10,
    maxTotalSizeMB = 100,
    disabled,
    name,
    className,
}: AttachmentInputProps) {
    const [files, setFiles] = useState<File[]>(value ?? []);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with parent
    useEffect(() => {
        if (value) setFiles(value);
    }, [value]);

    useEffect(() => {
        onChange?.(files);
    }, [files, onChange]);

    const totalSize = useMemo(() => files.reduce((a, b) => a + b.size, 0), [files]);

    // --- Validation ---
    const validate = useCallback(
        (incoming: File[]) => {
            const maxBytes = maxFileSizeMB * 1024 * 1024;
            const maxTotal = maxTotalSizeMB * 1024 * 1024;
            if (incoming.some((f) => f.size > maxBytes))
                return { ok: false, message: `Ukuran file melebihi ${maxFileSizeMB} MB` };
            if (files.length + incoming.length > maxFiles)
                return { ok: false, message: `Maksimal ${maxFiles} file terlampaui` };
            if (totalSize + incoming.reduce((a, b) => a + b.size, 0) > maxTotal)
                return { ok: false, message: `Total ukuran lampiran melebihi ${maxTotalSizeMB} MB` };
            return { ok: true };
        },
        [files.length, maxFileSizeMB, maxFiles, maxTotalSizeMB, totalSize]
    );

    // --- File Handlers ---
    const addFiles = useCallback(
        (incoming: FileList | File[]) => {
            setError(null);
            const arr = Array.from(incoming);
            const unique = dedupeFiles([...files, ...arr]);
            const newOnes = unique.slice(files.length);
            const v = validate(newOnes);
            if (!v.ok) return setError(v.message || "File tidak valid");
            setFiles(unique);
        },
        [files, validate]
    );

    const removeAt = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));
    const clearAll = () => setFiles([]);

    // --- UI Handlers ---
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        setDragOver(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    const onBrowse = () => inputRef.current?.click();

    // --- Render ---
    return (
        <div className={"w-full " + (className ?? "")}>
            {/* Dropzone */}
            <div
                className={[
                    "rounded-2xl border border-dashed p-5 sm:p-6 flex flex-col items-center gap-3 text-center",
                    dragOver ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400",
                    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                role="button"
                tabIndex={0}
                aria-disabled={disabled}
                onClick={() => !disabled && onBrowse()}
                onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === "Enter" || e.key === " ") onBrowse();
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
            >
                <UploadCloud className="w-6 h-6" aria-hidden />
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Drag & drop</span> file ke sini atau{" "}
                    <span className="underline">klik untuk memilih</span>
                </div>
                <div className="text-xs text-gray-500">
                    Maks {maxFiles} file • Maks {maxFileSizeMB}MB per file • Total ≤ {maxTotalSizeMB}MB
                    {accept ? ` • Tipe: ${accept}` : ""}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    multiple
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) addFiles(e.target.files);
                        e.currentTarget.value = "";
                    }}
                    disabled={disabled}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="mt-2 text-sm text-red-600" role="alert">
                    {error}
                </div>
            )}

            {/* Attachments List */}
            {files.length > 0 && (
                <div className="mt-3">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">
                            {files.length} lampiran • {bytesToReadable(totalSize)}
                        </span>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="ml-auto text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Hapus semua
                        </button>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                            <li
                                key={`${file.name}-${file.size}-${file.lastModified}`}
                                className="group inline-flex items-center gap-2 max-w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow transition"
                                title={file.name}
                            >
                                {file.type.startsWith("image/") ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-6 h-6 rounded object-cover"
                                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                ) : (
                                    <span className="text-gray-600">{fileIconByType(file)}</span>
                                )}
                                <span className="truncate text-sm max-w-[10rem] sm:max-w-[16rem]" aria-label={file.name}>
                                    {file.name}
                                </span>
                                <span className="text-xs text-gray-500">{bytesToReadable(file.size)}</span>
                                <button
                                    type="button"
                                    onClick={() => removeAt(idx)}
                                    className="ml-1 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100"
                                    aria-label={`Hapus ${file.name}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// --- Demo (for testing, can be removed) ---
export default function DemoEmailStyleAttachments() {
    const [attachments, setAttachments] = useState<File[]>([]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Mengirim ${attachments.length} lampiran (demo)`);
    };
    return (
        <div className="min-h-[60vh] bg-blue-50 p-6">
            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <AttachmentInput
                        value={attachments}
                        onChange={setAttachments}
                        accept="image/*,.pdf,.doc,.docx,.xlsx,.csv"
                        maxFiles={10}
                        maxFileSizeMB={10}
                        maxTotalSizeMB={100}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setAttachments([])}
                            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Kirim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
