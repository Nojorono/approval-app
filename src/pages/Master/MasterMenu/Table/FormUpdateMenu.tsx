import React, { useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import {
  FaRegFileAlt,
  FaDollarSign,
  FaRegNewspaper,
  FaClipboardList,
  FaRoute,
  FaUserTag,
  FaChartLine,
  FaCreditCard,
  FaList,
} from "react-icons/fa";
import { showSuccessToast } from "../../../../components/toast";

const UpdateModal = ({
  isOpen,
  onClose,
  existingData,
  onRefresh,
}: {
  isOpen: boolean;
  onClose: () => void;
  existingData: any;
  onRefresh: () => void;
}) => {
  const { updateMenu, parentMenus } = useMenuStore();

  const parentMenuOpt = useMemo(
    () => parentMenus.map((menu) => ({ value: menu.id, label: menu.name })),
    [parentMenus]
  );

  const iconOptions = [
    { value: "FaRegFileAlt", label: "Master Data", icon: <FaRegFileAlt /> },
    { value: "FaDollarSign", label: "Bank Account", icon: <FaDollarSign /> },
    { value: "FaClipboardList", label: "Report", icon: <FaClipboardList /> },
    { value: "FaRoute", label: "Route", icon: <FaRoute /> },
    { value: "FaUserTag", label: "Sales & Distribution", icon: <FaUserTag /> },
    { value: "FaChartLine", label: "Target Sales", icon: <FaChartLine /> },
    { value: "FaRegNewspaper", label: "News", icon: <FaRegNewspaper /> },
    { value: "FaCreditCard", label: "Credit Limit", icon: <FaCreditCard /> },
    { value: "FaList", label: "List", icon: <FaList /> },
  ];

  const formFields = [
    {
      name: "name",
      label: "Menu Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "path",
      label: "Path",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "icon",
      label: "Icon",
      type: "select",
      options: iconOptions.map((option) => ({
        value: option.value,
        label: (
          <div key={option.value} className="flex items-center space-x-1">
            {option.icon}
            <span>{option.label}</span>
          </div>
        ),
      })),
    },
    {
      name: "parentId",
      label: "Parent",
      type: "select",
      options: [{ value: 0, label: "Tidak Ada" }, ...parentMenuOpt],
      validation: { required: "Required" },
    },
    {
      name: "order",
      label: "Order",
      type: "text",
      validation: { required: "Required" },
    },
  ];

  const handleSubmit = async (data: any) => {
    const payload = {
      ...data,
      parentId: data.parentId?.value
        ? Number(data.parentId.value)
        : Number(data.parentId),
      order: Number(data.order),
      icon: data.icon?.value || data.icon,
    };

    const res = await updateMenu(existingData.id, payload);

    if (!res.ok) {
      return;
    }
    onRefresh();
    onClose();
    showSuccessToast("Menu berhasil diupdate");
  };

  // Siapkan default values dari data lama
  const defaultValues = {
    ...existingData,
    parentId: {
      value: existingData.parentId || 0,
      label: "Loading...", // Fallback jika parentId masih null
    },
    icon: {
      value: existingData.icon || "",
      label: "Loading...", // Fallback jika icon masih null
    },
  };

  // Isi label dari parentId dan icon berdasarkan options
  const parentMatch = parentMenuOpt.find(
    (opt) => opt.value === existingData.parentId
  );
  if (parentMatch) defaultValues.parentId.label = parentMatch.label;

  const iconMatch = iconOptions.find((opt) => opt.value === existingData.icon);
  if (iconMatch) defaultValues.icon.label = iconMatch.label;

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      formFields={formFields}
      title="Edit Menu"
      defaultValues={defaultValues}
    />
  );
};

export default UpdateModal;
