import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore.ts";
import {
  FaRegFileAlt,
  FaDollarSign,
  FaRegNewspaper,
  FaClipboardList,
  FaRoute,
  FaUserTag,
  FaChartLine,
  FaCreditCard,
  FaPlus,
  FaFlag,
} from "react-icons/fa";
import Button from "../../../../components/ui/button/Button.tsx";
// import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import { showErrorToast, showSuccessToast } from "../../../../components/toast";

const MenuFormSection = ({ onRefresh }: { onRefresh: () => void }) => {
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
      label: "uom name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "capacity",
      label: "capacity",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "is active",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      validation: { required: "Required" },
    },
    {
      name: "isEmpty",
      label: "is empty",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      validation: { required: "Required" },
    },
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
      label: "uom name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "capacity",
      label: "capacity",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "is active",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      validation: { required: "Required" },
    },
    {
      name: "isEmpty",
      label: "is empty",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      validation: { required: "Required" },
    },
  ];

  const handleSubmit = async (data: any) => {
    const payload = {
      ...data,
      order: Number(data.order),
      icon: data.icon?.value || data.icon,
    };

    // Only add parentId if it's not 0, null, or undefined
    const parentId =
      data.parentId?.value !== undefined
        ? Number(data.parentId.value)
        : Number(data.parentId);

    if (parentId) {
      payload.parentId = parentId;
    }

    // const res = await createMenu(payload);

    // if (!res.ok) {
    //   return;
    // }
    onRefresh();
    showSuccessToast("Menu berhasil ditambahkan");
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500);
  };

  return (
    <>
      {/* {canManage && canCreate && ( */}
      <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" /> Tambah Menu
      </Button>
      {/* )} */}

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formFields={formFields}
        title="Create Menu"
      />
    </>
  );
};

export default MenuFormSection;
