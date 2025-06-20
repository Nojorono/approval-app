import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { useIOStore } from "../../../../API/store/MasterStore";
import { FaPlus } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button.tsx";
// import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/toast/index.tsx";

const CreateForm = ({ onRefresh }: { onRefresh: () => void }) => {
  const { createIOData, error } = useIOStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formFields = [
    {
      name: "organization_id",
      label: "Organization Id",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "organization_name",
      label: "Organization Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "operating_unit",
      label: "Operating Unit",
      type: "text",
      validation: { required: "Required" },
    },
  ];

  const handleSubmit = async (form: any) => {
    const payload = {
      organization_id: Number(form.organization_id),
      organization_name: form.organization_name,
      operating_unit: form.operating_unit,
    };

    const { success, message } = await createIOData(payload);

    if (success) {
      onRefresh();
      setIsModalOpen(false);
    } else {
      console.warn("Create IO failed:", message);
    }
  };

  return (
    <>
      {/* {canManage && canCreate && ( */}
      {/* )} */}
      <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" /> Tambah IO
      </Button>

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
