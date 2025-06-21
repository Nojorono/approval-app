import React, { useState } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import Button from "../../../../components/ui/button/Button.tsx";
import { showSuccessToast } from "../../../../components/toast/index.tsx";
import {
  createPallet,
  updatePallet,
} from "../../../../API/services/MasterServices/MasterPalletService.tsx";
import Badge from "../../../../components/ui/badge/Badge.tsx";
import { FaEye } from "react-icons/fa";

const UpdateForm = ({
  onRefresh,
  defaultValues,
}: {
  onRefresh: () => void;
  defaultValues: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formFields = [
    {
      name: "organization_id",
      label: "Organization Id",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "pallet_code",
      label: "Pallet Code",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "uom_name",
      label: "UOM Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "Is Active",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
      validation: { required: "Required" },
    },
    {
      name: "isEmpty",
      label: "Is Empty",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      validation: { required: "Required" },
    },
  ];

  const handleSubmit = async (data: any) => {
    // Ensure that the capacity is a number
    console.log("PALLET", data);
    const payload = {
      organization_id: Number(data.organization_id),
      capacity: Number(data.capacity),
      pallet_code: data.pallet_code,
      uom_name: data.uom_name,
      isEmpty: data.isEmpty,
      isActive: data.isActive,
    };

    const res = await updatePallet(data.id, payload);

    if (!res.success) {
      return;
    }
    onRefresh();
    showSuccessToast("Pallet berhasil diperbaharui");
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500);
  };

  return (
    <>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        <Badge variant="solid" size="sm" color="secondary">
          <FaEye />
          Show
        </Badge>
      </button>

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formFields={formFields}
        title="Update"
        defaultValues={{
          id: defaultValues.id,
          organization_id: defaultValues.organization_id,
          pallet_code: defaultValues.pallet_code,
          uom_name: defaultValues.uom_name,
          capacity: defaultValues.capacity,
          isActive: defaultValues.isActive,
          isEmpty: defaultValues.isEmpty,
        }}
        isEditMode={true}
      />
    </>
  );
};

export default UpdateForm;
