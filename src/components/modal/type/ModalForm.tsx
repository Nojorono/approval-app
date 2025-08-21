import React from "react";
import ModalComponent from "../ModalComponent";
import FormModal from "../../form-input/FormModal";

interface ReusableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formFields: Array<any>;
  title: string;
  defaultValues?: any;
  isEditMode?: boolean;
  setIsEditMode?: (val: boolean) => void;
  viewOnly?: boolean;
}

const ReusableFormModal: React.FC<ReusableFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formFields,
  title,
  defaultValues,
  isEditMode = false,
  viewOnly = false,
}) => {
  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? "Detail" : title}
        size="large"
      >
        <FormModal
          formFields={formFields}
          onSubmit={(data) => {
            onSubmit(data);
          }}
          onClose={onClose}
          defaultValues={defaultValues}
          isEditMode={isEditMode}
          viewOnly={viewOnly}
        />
      </ModalComponent>
    </>
  );
};

export default ReusableFormModal;
