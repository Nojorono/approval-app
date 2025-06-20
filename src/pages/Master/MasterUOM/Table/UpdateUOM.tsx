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
    try {
      const { id, ...rest } = data;
      const payload = {
        code: rest.code,
        name: rest.name,
        description: rest.description,
        isActive: !!rest.isActive,
      };
      await updateUomData(id, payload);

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
        isEditMode={true}
      />
    </>
  );
};

export default UpdateForm;
