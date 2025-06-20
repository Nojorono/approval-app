import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { useUomStore } from "../../../../API/store/MasterStore";
// import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/toast/index.tsx";

const UpdateForm = ({
  onRefresh,
  isModalOpen,
  setIsModalOpen,
  defaultValues,
}: {
  onRefresh: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  defaultValues?: any;
}) => {
  const { updateUomData, error } = useUomStore();

  const formFields = [
    {
      name: "code",
      label: "Kode UOM",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "name",
      label: "Nama UOM",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "",
      type: "checkbox",
    },
  ];

  const submitModal = async (data: any) => {
    const { id, ...rest } = data;
    const payload = {
      code: rest.code,
      name: rest.name,
      description: rest.description,
      isActive: !!rest.isActive,
    };
    const { success, message } = await updateUomData(id, payload);

    if (success) {
      onRefresh();
      setIsModalOpen(false);
    } else {
      console.warn("Update UOM failed:", message);
    }
  };

  return (
    <>
      <ReusableFormModal
        isEditMode={true}
        title="Detail UOM"
        isOpen={isModalOpen ?? false}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitModal}
        formFields={formFields}
        defaultValues={{
          id: defaultValues?.id ?? "",
          code: defaultValues?.code ?? "",
          name: defaultValues?.name ?? "",
          description: defaultValues?.description ?? "",
          isActive: defaultValues?.isActive ?? "",
        }}
      />
    </>
  );
};

export default UpdateForm;
