import { ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "small" | "medium" | "large" | "xl";
  height?: string; // Tambahkan properti height
}

const ModalComponent = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}: ModalProps) => {
  const sizeClasses = {
    small: "sm:max-w-sm",
    medium: "sm:max-w-3xl",
    large: "sm:max-w-7xl",
    xl: "sm:max-w-9xl",
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-[1000]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-h-[90vh] ${sizeClasses[size]}`}
          >
            <div className="relative flex flex-col h-full">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 border-b">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {title}
                </DialogTitle>
              </div>

              {/* Body (scrollable if needed) */}
              <div
                className="overflow-y-auto p-6"
                style={{ maxHeight: "calc(90vh - 120px)" }} // hitung tinggi modal dikurangi header & padding
              >
                {children}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalComponent;
