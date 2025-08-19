// Size S using
{
  /* <ModalDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Hapus Data?"
  description="Yakin ingin menghapus data ini?"
  size="sm"
/> */
}

// // Size L Using
// <ModalDialog
//   isOpen={isOpen}
//   onClose={handleClose}
//   onConfirm={handleConfirm}
//   title="Edit Informasi"
//   size="lg"
// >
//   <form>
//     <input className="border w-full p-2 rounded" placeholder="Nama" />
//     {/* Field lainnya */}
//   </form>
// </ModalDialog>

// // Size XL Using
{
  /* <ModalDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Data yang akan diproses"
  size="xl"
  confirmText="Proses"
  cancelText="Tutup"
>
  <div className="overflow-x-auto">
    <TableCOmponent/>
  </div>
</ModalDialog> */
}

import React from "react";
import clsx from "clsx";

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  size?: "sm" | "lg" | "xl";
}

const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  size = "sm",
}) => {
  if (!isOpen) return null;

  // Mapping size to Tailwind max-width class
  const sizeClass = {
    sm: "sm:max-w-md",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-5xl",
  }[size];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div
        className={clsx(
          "relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-h-screen overflow-y-auto",
          sizeClass
        )}
      >
        {/* Header & Description */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
              <svg
                className="size-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              {description && (
                <div className="mt-2 text-sm text-gray-500">{description}</div>
              )}
            </div>
          </div>

          {/* Custom content */}
          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0 sm:w-auto"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;
