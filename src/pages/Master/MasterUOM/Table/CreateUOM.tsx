import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { useMenuStore } from "../../../../API/store/MasterStore/MasterMenuStore.ts";
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
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/toast/index.tsx";

const CreateForm = ({ onRefresh }: { onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    console.log("Form Data:", data);

    const payload = {
      ...data,
    };

    console.log("Payload:", payload);
    

    // // Only add parentId if it's not 0, null, or undefined
    // const parentId =
    //   data.parentId?.value !== undefined
    //     ? Number(data.parentId.value)
    //     : Number(data.parentId);

    // if (parentId) {
    //   payload.parentId = parentId;
    // }

    // // const res = await createMenu(payload);

    // // if (!res.ok) {
    // //   return;
    // // }
    // onRefresh();
    // showSuccessToast("Menu berhasil ditambahkan");
    // setTimeout(() => {
    //   setIsModalOpen(false);
    // }, 500);
  };

  return (
    <>
      {/* {canManage && canCreate && ( */}
      <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" /> Tambah UOM
      </Button>
      {/* )} */}

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formFields={formFields}
        title="Create UOM"
      />
    </>
  );
};

export default CreateForm;
