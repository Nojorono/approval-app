import React from "react";

interface MiniActivityIndicatorProps {
  message?: string;
  className?: string;
}

const MiniActivityIndicator: React.FC<MiniActivityIndicatorProps> = ({
  message = "Loading...",
  className = "",
}) => (
  <div
    className={`absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50 ${className}`}
  >
    <svg
      className="animate-spin h-10 w-10 text-blue-600 mb-2"
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
    <span className="text-blue-700 font-semibold">{message}</span>
  </div>
);

export default MiniActivityIndicator;
