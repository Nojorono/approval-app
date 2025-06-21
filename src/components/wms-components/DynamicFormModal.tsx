import React from "react";
import ReusableFormModal from "../../components/modal/ReusableFormModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean }>;
  onUpdate: (data: any) => Promise<{ success: boolean }>;
  defaultValues?: any;
  isEditMode?: boolean;
  formFields: any[];
  title?: string;
}

const DynamicFormModal = ({
  isOpen,
  onClose,
  onRefresh,
  defaultValues,
  isEditMode,
  onSubmit,
  onUpdate,
  formFields,
  title,
}: Props) => {
  const handleSubmit = async (data: any) => {
    const res = isEditMode ? await onUpdate(data) : await onSubmit(data);
    if (res?.success) {
      onRefresh();
      onClose();
    }
  };
  
  return (
    <ReusableFormModal
      isEditMode={isEditMode}
      title={isEditMode ? "Datail & Update Data" : "Create Data"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      formFields={formFields}
      defaultValues={defaultValues}
    />
  );
};

export default DynamicFormModal;
