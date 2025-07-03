import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  useStoreUser,
  useStoreCheckerAssign,
} from "../../../../DynamicAPI/stores/Store/MasterStore";
import { useForm, Controller } from "react-hook-form";
import Button from "../../../../components/ui/button/Button";

const animatedComponents = makeAnimated();

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  validation?: any;
}

interface CheckerOption {
  label: string;
  value: string;
}

interface FormData {
  [key: string]: any;
}

interface ModalProps {
  formFields: FormField[];
  defaultValues?: FormData;
  parmeters?: any;
  onClose?: () => void;
}

const AssignChecker: React.FC<ModalProps> = ({
  formFields,
  parmeters,
  onClose,
}) => {
  const { fetchAll, list: userData } = useStoreUser();
  const { createData } = useStoreCheckerAssign();

  useEffect(() => {
    fetchAll();
  }, []);

  // Generate checker options from userData
  const checkerOptions: CheckerOption[] = userData.map((user: any) => ({
    value: user.id,
    label: user.firstName + " " + user.lastName,
  }));

  // Set defaultValues from formFields
  const defaultValues: FormData = {};
  formFields.forEach((field) => {
    if (field.type === "multiselect") defaultValues[field.name] = [];
    else defaultValues[field.name] = "";
  });

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      inbound_plan_id: parmeters.id,
      checker_leader_id: data.checker_leader_id,
      checkers: data.checkers.map((checker: { value: any; label: any }) => ({
        id: checker.value,
        name: checker.label,
      })),
      assign_date_start: data.assign_date_start,
      assign_date_finish: data.assign_date_finish,
      status: "ASSIGNED",
    };

    console.log("Submitting data:", payload);
    createData(payload);
    onClose && onClose();
  };

  // Helper to render field by type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case "select":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <Select
                isClearable
                options={field.options || checkerOptions}
                value={
                  (field.options || checkerOptions).find(
                    (opt) => opt.value === controllerField.value
                  ) || null
                }
                onChange={(option) =>
                  controllerField.onChange(option ? option.value : "")
                }
                placeholder={field.label}
              />
            )}
          />
        );
      case "multiselect":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <Select
                isMulti
                options={field.options || checkerOptions}
                components={animatedComponents}
                value={controllerField.value}
                onChange={(value) => controllerField.onChange(value)}
                placeholder={field.label}
              />
            )}
          />
        );
      case "datetime-local":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2"
                value={controllerField.value}
                onChange={controllerField.onChange}
              />
            )}
          />
        );
      default:
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <input
                type={field.type}
                className="w-full border rounded px-3 py-2"
                placeholder={field.label}
                value={controllerField.value}
                onChange={controllerField.onChange}
              />
            )}
          />
        );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block mb-2 font-medium">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignChecker;
