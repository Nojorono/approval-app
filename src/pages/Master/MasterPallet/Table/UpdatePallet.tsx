import React, {useEffect, useState} from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal.tsx";
import { FaPlus } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button.tsx";
import { showSuccessToast } from "../../../../components/toast/index.tsx";
import {createPallet, updatePallet} from "../../../../API/services/MasterServices/MasterPalletService.tsx";
import {usePalletStore} from "../../../../API/store/MasterStore/masterPalletStore.ts";

const UpdateForm = ({ onRefresh }: { onRefresh: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { dataPallet,fetchPalletById } = usePalletStore();

    useEffect(() => {
        // fetchPalletById()
    }, []);

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
        const payload = {
            ...data,
            organization_id: Number(data.organization_id),
            capacity: Number(data.capacity), // Converts capacity to number
        };

        const res = await createPallet(payload);

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
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                Detail
            </Button>

            <ReusableFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                formFields={formFields}
                title="Update Pallet"
            />
        </>
    );
};

export default UpdateForm;
