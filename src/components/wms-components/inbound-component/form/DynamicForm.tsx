import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../../form/date-picker";

export interface Option {
  value: string;
  label: string;
}

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "custom" | "date" | "radio" | "file";
  options?: Option[];
  element?: React.ReactNode;
  disabled?: boolean;
};

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  control: any;
  register: any;
  setValue: any;
  handleSubmit: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  defaultValues = {},
  control,
  register,
  setValue,
  handleSubmit,
}) => {
  useEffect(() => {
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [defaultValues, setValue]);

  const commonClasses =
    "w-full px-3 py-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  const disabledClasses = "bg-gray-100 text-gray-500 cursor-not-allowed";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-1">
            {field.label}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              {...register(field.name)}
              className={`${commonClasses} ${
                field.disabled ? disabledClasses : ""
              }`}
              disabled={field.disabled}
              readOnly={field.disabled}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              {...register(field.name)}
              rows={3}
              className={`${commonClasses} ${
                field.disabled ? disabledClasses : ""
              }`}
              disabled={field.disabled}
              readOnly={field.disabled}
            />
          )}

          {field.type === "select" && field.options && (
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <Select
                  {...controllerField}
                  options={field.options}
                  className={`react-select-container text-sm ${
                    field.disabled ? "bg-gray-100 text-gray-400" : ""
                  }`}
                  classNamePrefix="react-select"
                  isDisabled={field.disabled}
                  styles={
                    field.disabled
                      ? {
                          control: (base) => ({
                            ...base,
                            backgroundColor: "#f3f4f6",
                            color: "#9ca3af",
                            cursor: "not-allowed",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#9ca3af",
                          }),
                        }
                      : undefined
                  }
                />
              )}
            />
          )}

          {field.type === "date" && (
            <Controller
              control={control}
              name={field.name}
              render={({ field }) => (
                <DatePicker
                  id={field.name}
                  label=""
                  defaultDate={field.value}
                  onChange={([date]: Date[]) => field.onChange(date)}
                  readOnly={field.disabled}
                />
              )}
            />
          )}

          {field.type === "file" && (
            <input
              type="file"
              {...register(field.name)}
              className={`${commonClasses} ${
                field.disabled ? disabledClasses : ""
              }`}
              disabled={field.disabled}
              readOnly={field.disabled}
            />
          )}

          {field.type === "custom" && field.element && (
            <div className="flex items-center gap-2">{field.element}</div>
          )}
        </div>
      ))}
    </form>
  );
};
export default DynamicForm;
