import React, { useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../components/tables/MasterDataTable/TableApprovalRequest";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DynamicFormModal from "./DynamicFormModal";
import { useStoreUserDecrypt } from "../../DynamicAPI/stores/Store/MasterStore";
import ModalDecrypt from "../modal/type/ModalDecrypt";

interface Props {
  data: any[];
  globalFilter?: string;
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  columns: ColumnDef<any>[];
  formFields: any[];
  onSubmit: (data: any) => Promise<any>;
  onUpdate: (data: any) => Promise<any>;
  onDelete: (id: any) => Promise<void>;
  onRefresh: () => void;
  getRowId?: (row: any) => any;
  title?: string;
  viewOnly?: boolean;
  isDeleteDisabled?: boolean;
}

const DynamicTable = ({
  data,
  globalFilter,
  isCreateModalOpen,
  onCloseCreateModal,
  columns,
  formFields,
  onSubmit,
  onUpdate,
  onDelete,
  onRefresh,
  getRowId = (row) => row.id,
  title,
  viewOnly = false,
  isDeleteDisabled,
}: Props) => {
  const { fetchById, detail } = useStoreUserDecrypt();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const enhancedColumns = useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="text-blue-600"
              onClick={() => decryptHandle(row.original.id)}
            >
              <FaEye />
            </button>

            <button
              className="text-green-600"
              onClick={() => setSelectedItem(row.original)}
            >
              <FaEdit />
            </button>

            {!isDeleteDisabled && (
              <button
                onClick={() => handleDelete(getRowId(row.original))}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ),
      },
    ];
  }, [columns, isDeleteDisabled, getRowId]);

  const handleDelete = useCallback(
    async (id: any) => {
      await onDelete(id);
      await onRefresh();
    },
    [onDelete, onRefresh]
  );

  const handleCloseModal = () => {
    setSelectedItem(null);
    onCloseCreateModal();
  };

  const [showDecryptModal, setShowDecryptModal] = useState(false);

  const decryptHandle = async (id: any) => {
    await fetchById(id);
    setShowDecryptModal(true);
  };

  return (
    <>
      <DynamicFormModal
        isOpen={!!selectedItem || isCreateModalOpen}
        onClose={handleCloseModal}
        defaultValues={selectedItem || undefined}
        isEditMode={!!selectedItem}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onRefresh={onRefresh}
        formFields={formFields}
        title={title}
        viewOnly={viewOnly}
      />

      <TableComponent
        data={data}
        columns={enhancedColumns}
        globalFilter={globalFilter}
      />

      <ModalDecrypt
        isOpen={showDecryptModal}
        onClose={() => setShowDecryptModal(false)}
        detail={detail}
      />
    </>
  );
};

export default DynamicTable;
