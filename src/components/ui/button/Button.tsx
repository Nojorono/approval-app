import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "xsm" | "sm" | "md"; // Button size
  variant?:
    | "primary"
    | "outline"
    | "secondary"
    | "danger"
    | "rounded"
    | "action"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional class names
  type?: "button" | "submit" | "reset"; // Button type
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // Default type is "button"
}) => {
  // Size Classes
  const sizeClasses = {
    xsm: "px-3 py-2 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    rounded:
      "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    primary:
      "bg-[#0d775b] text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    secondary:
      "bg-[#98c9b7] text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    danger:
      "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
    action:
      "bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300",
    outline:
      "bg-white text-green-700 ring-1 ring-inset ring-green-300 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:ring-green-700 dark:hover:bg-white/[0.03] dark:hover:text-green-300",
  };

  return (
    <button
      type={type} // Set the button type
      className={`inline-flex items-center justify-center gap-2 transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        variant === "rounded" ? "rounded-full" : "rounded-lg"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
