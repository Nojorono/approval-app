import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { useUomStore } from "../../../../API/store/MasterStore";
// import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/toast/index.tsx";

const CreateForm = ({
  onRefresh,
  isModalOpen,
  setIsModalOpen,
}: {
  onRefresh: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const { createUomData, error } = useUomStore();

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

  const handleSubmit = async (data: any) => {
    try {
      const payload = { ...data };
      await createUomData(payload);

      if (error) {
        showErrorToast(error);
        return;
      }
      onRefresh();
      showSuccessToast("UOM berhasil ditambahkan");
      setTimeout(() => {
        setIsModalOpen(false);
      }, 500);
    } catch (error: any) {
      showErrorToast(error?.message || "Failed to create UOM");
    }
  };

  return (
    <>
      <ReusableFormModal
        title="Create UOM"
        isOpen={isModalOpen ?? false}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formFields={formFields}
        mode="create"
      />
    </>
  );
};

export default CreateForm;
