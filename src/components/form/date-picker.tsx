import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  hasError?: boolean;
  position?:
    | "auto"
    | "above"
    | "below"
    | "auto left"
    | "auto center"
    | "auto right"
    | "above left"
    | "above center"
    | "above right"
    | "below left"
    | "below center"
    | "below right";
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  readOnly = false,
  hasError = false,
  position = "auto",
}: PropsType) {
  useEffect(() => {
    const instance = flatpickr(`#${id}`, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
      clickOpens: !readOnly,
      position,
    });

    return () => {
      if (Array.isArray(instance)) {
        instance.forEach((inst) => inst.destroy());
      } else {
        instance.destroy();
      }
    };
  }, [id, mode, onChange, defaultDate, readOnly, position]);

  const inputClass = `
    h-11 w-full rounded-lg appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400
    ${
      readOnly
        ? "bg-gray-100 text-gray-500 border-gray-100 cursor-not-allowed"
        : hasError
        ? "!border-red-500 !ring-1 !ring-red-400 text-gray-800"
        : "border border-gray-300 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
    }
  `;

  return (
    <div key={defaultDate?.toString()}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className={`relative ${readOnly ? "cursor-not-allowed" : ""}`}>
        <input
          id={id}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`${inputClass} flatpickr-input`}
          style={{
            ...(readOnly ? { cursor: "not-allowed" } : {}),
            ...(hasError ? { borderColor: "red", borderWidth: "1px" } : {}),
          }}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}

// export default function DatePicker({
//   id,
//   mode,
//   onChange,
//   label,
//   defaultDate,
//   placeholder,
//   readOnly = false,
//   hasError = false,
//   position = "auto", // Default position
// }: PropsType) {
//   useEffect(() => {
//     const flatPickr = flatpickr(`#${id}`, {
//       mode: mode || "single",
//       static: true,
//       monthSelectorType: "static",
//       dateFormat: "Y-m-d",
//       defaultDate,
//       onChange,
//       clickOpens: !readOnly,
//       position, // Tambahkan position di sini
//     });

//     return () => {
//       if (!Array.isArray(flatPickr)) {
//         flatPickr.destroy();
//       }
//     };
//   }, [mode, onChange, id, defaultDate, readOnly, position]);

//   return (
//     <div key={defaultDate?.toString()}>
//       {label && <Label htmlFor={id}>{label}</Label>}
//       <div className={`relative ${readOnly ? "cursor-not-allowed" : ""}`}>
//         <input
//           id={id}
//           placeholder={placeholder}
//           readOnly={readOnly}
//           className={`h-11 w-full rounded-lg appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400
//     ${
//       readOnly
//         ? "bg-gray-100 text-gray-500 border-gray-100 cursor-not-allowed !cursor-not-allowed"
//         : hasError
//         ? "border-red-500 bg-transparent text-gray-800"
//         : "border border-gray-300 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
//     }`}
//           style={readOnly ? { cursor: "not-allowed" } : {}}
//         />

//         <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//           <CalenderIcon className="size-6" />
//         </span>
//       </div>
//     </div>
//   );
// }
