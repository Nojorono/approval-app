import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import MultiFileUploader, { deleteFileFromS3 } from "../file-upload";
import MiniActivityIndicator from "../ui/miniActivityIndicator";

type FormField = {
  placeholder: string;
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "number"
    | "file"
    | "multifile"
    | "date"
    | "checkbox"
    | "radio";
  options?: { value: string | boolean; label: string }[];
  validation?: {
    required?: boolean | string;
    [key: string]: any;
  };
  info?: string;
};

type FormValues = Record<string, any>;

type FormInputProps = {
  formFields: FormField[];
  onSubmit: SubmitHandler<FormValues>;
  onClose: () => void;
  defaultValues?: FormValues;
  isEditMode?: boolean;
  viewOnly?: boolean;
};

const ModalForm: React.FC<FormInputProps> = ({
  formFields,
  onSubmit,
  onClose,
  defaultValues,
  isEditMode,
  viewOnly,
}) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormValues>({
    defaultValues,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data); // Kirim data ke parent
  };

  // === ketika modal diclose ===
  const handleClose = async () => {
    setIsLoading(true);
    try {
      const values = getValues();

      // Hanya hapus file dari S3 jika BUKAN edit mode
      if (!isEditMode) {
        for (const field of formFields) {
          if (field.type === "multifile" && Array.isArray(values[field.name])) {
            for (const fileUrl of values[field.name]) {
              await deleteFileFromS3(fileUrl); // 🔸 pakai helper dari uploader
            }
          }
        }
      }
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      onClose();
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300";
    const errorClasses =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-300 bg-gray-100 cursor-not-allowed text-gray-500";

    const isDisabled = isEditMode && !isEditing;

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...register(field.name, field.validation)}
            className={isDisabled ? errorClasses : commonClasses}
            disabled={isDisabled}
          />
        );
      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              ...field.validation,
              required: field.validation?.required ?? false,
            }}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={field.options}
                placeholder={field.placeholder || "Select an option"}
                className={isDisabled ? errorClasses : "react-select-container"}
                classNamePrefix="react-select"
                value={field.options?.find(
                  (option) => option.value === controllerField.value
                )}
                onChange={(selectedOption) => {
                  const value =
                    selectedOption?.value === false
                      ? false
                      : selectedOption?.value;
                  controllerField.onChange(value);
                }}
                menuPlacement="auto"
                isDisabled={isDisabled}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            )}
          />
        );
      case "multiselect":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              ...field.validation,
              required: field.validation?.required ?? false,
            }}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={field.options}
                placeholder={field.placeholder || "Select options"}
                className={isDisabled ? errorClasses : "react-select-container"}
                classNamePrefix="react-select"
                isMulti
                value={field.options?.filter((option) =>
                  Array.isArray(controllerField.value)
                    ? controllerField.value.includes(option.value)
                    : false
                )}
                onChange={(selectedOptions) => {
                  const values = Array.isArray(selectedOptions)
                    ? selectedOptions.map((opt) => opt.value)
                    : [];
                  controllerField.onChange(values);
                }}
                menuPlacement="auto"
                isDisabled={isDisabled}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            )}
          />
        );
      case "file":
        return (
          <input
            type="file"
            {...register(field.name, field.validation)}
            className={isDisabled ? errorClasses : commonClasses}
            disabled={isDisabled}
          />
        );
      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <DatePicker
                id="date-picker"
                placeholder="Select a date"
                onChange={(date: Date | Date[]) =>
                  controllerField.onChange(Array.isArray(date) ? date[0] : date)
                }
                readOnly={isDisabled}
              />
            )}
          />
        );
      case "checkbox":
        return (
          <div>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <Checkbox
                  label={field.name}
                  checked={controllerField.value || false}
                  onChange={(checked) => controllerField.onChange(checked)}
                  disabled={isEditMode && !isEditing}
                />
              )}
            />
            {field.info && (
              <p className="text-sm text-gray-500 mt-1 italic">{field.info}</p>
            )}
          </div>
        );
      case "text":
        return (
          <input
            type={field.type}
            {...register(field.name, field.validation)}
            className={isDisabled ? errorClasses : commonClasses}
            disabled={isDisabled}
          />
        );
      case "multifile":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <MultiFileUploader
                value={controllerField.value || []}
                onChange={controllerField.onChange}
                className={isDisabled ? errorClasses : commonClasses}
                disabled={isDisabled}
                isLoadingUpload={setIsUploading}
              />
            )}
          />
        );
      default:
        return (
          <input
            type={field.type}
            {...register(field.name, field.validation)}
            className={isDisabled ? errorClasses : commonClasses}
            disabled={isDisabled}
          />
        );
    }
  };

  // Split fields into two columns only if there are more than 6 fields
  const leftFields =
    formFields.length > 6
      ? formFields.slice(0, Math.ceil(formFields.length / 2))
      : formFields;
  const rightFields =
    formFields.length > 6
      ? formFields.slice(Math.ceil(formFields.length / 2))
      : [];

  return (
    <div className="mx-auto mt-5 p-6 rounded-md bg-red relative">
      {isLoading && <MiniActivityIndicator />}
      <form
        onSubmit={handleFormSubmit(handleSubmit)}
        className="space-y-4 mb-5"
      >
        <div
          className={`grid ${
            formFields.length > 6 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          } gap-6`}
        >
          <div>
            {leftFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors[field.name] as any).message}
                  </p>
                )}
              </div>
            ))}
          </div>
          {rightFields.length > 0 && (
            <div>
              {rightFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {(errors[field.name] as any).message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          {(!isEditMode || isEditing) && (
            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={isLoading || isUploading}
            >
              Submit
            </Button>
          )}

          {isEditMode && !isEditing && !viewOnly && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setIsEditing(true)}
              disabled={isLoading || isUploading}
            >
              Update
            </Button>
          )}

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleClose}
            disabled={isLoading || isUploading}
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModalForm;
