import ReusableFormModal from "../modal/type/ModalForm";

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
  viewOnly?: boolean;
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
  viewOnly
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
      title={title ? title : isEditMode ? "Detail & Update Data" : "Create Data"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      formFields={formFields}
      defaultValues={defaultValues}
      viewOnly={viewOnly}
    />
  );
};

export default DynamicFormModal;
