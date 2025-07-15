import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../../../../../components/toast";
import { ModalForm } from "../../../../../../components/modal/type";
import Badge from "../../../../../../components/ui/badge/Badge";
import { FaTrash } from "react-icons/fa";

interface DetailInboundItemProps {
  data: any;
  isEditMode: boolean;
  onItemsChange?: any;
}

const DetailInboundItem: React.FC<DetailInboundItemProps> = ({
  data,
  isEditMode,
  onItemsChange,
}) => {
  const [editableItems, setEditableItems] = useState<any[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [editItemData, setEditItemData] = useState<any>(null);



  const skuOptions = [
    {
      id: "f7b2a026-3c4e-45a6-8db9-21022044b9b6",
      sku: "NIKI16",
      name: "RK.NKI.160000",
      description: "NIKKI SUPER 16",
    },
    {
      id: "72a6a831-dc00-418a-9a61-c46602a516bf",
      sku: "JZB20",
      name: "RK.JZB.200000",
      description: "JAZY BOLD - 20",
    },
  ];

  const manualFormFields = [
    {
      name: "sku",
      label: "SKU",
      type: "select",
      options: [
        { label: "-- Select SKU --", value: "" },
        ...skuOptions.map((sku) => ({
          label: `${sku.sku}`,
          value: sku.sku,
        })),
      ],
    },
    {
      name: "qty_plan",
      label: "Qty Plan",
      type: "number",
    },
    {
      name: "uom",
      label: "UOM",
      type: "select",
      options: [
        { label: "-- Select UOM --", value: "" },
        { label: "DUS", value: "DUS" },
        { label: "PCS", value: "PCS" },
        // Tambahkan opsi lain jika diperlukan
      ],
    },
    {
      name: "classification_name",
      label: "Classification",
      type: "select",
      options: [
        { label: "-- Select Classification --", value: "" },
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
        // Tambahkan opsi lain jika diperlukan
      ],
    },
  ];

  const handleDeleteRow = (index: number) => {
    const newItems = [...editableItems];
    newItems.splice(index, 1);
    setEditableItems(newItems);
  };

  const handleEditRow = (index: number) => {
    setEditItemIndex(index);
    setEditItemData(editableItems[index]);
    setEditModalOpen(true);
  };

  const handleQtyChange = (index: number, value: string) => {
    const newItems = [...editableItems];
    newItems[index] = {
      ...newItems[index],
      qty_plan: value,
    };
    setEditableItems(newItems);
  };

  const handleSaveRow = () => {
    setEditingIndex(null);
  };

  const handleEditModalSubmit = (formData: any) => {
    if (editItemIndex !== null) {
      const newItems = [...editableItems];
      newItems[editItemIndex] = {
        ...newItems[editItemIndex],
        ...formData,
      };
      setEditableItems(newItems);
      setEditModalOpen(false);
      setEditItemIndex(null);
      setEditItemData(null);
    }
  };

  const handleResetRow = (index: number) => {
    const newItems = [...editableItems];
    newItems[index] = data[index];
    setEditableItems(newItems);
  };

  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(editableItems);
    }
  }, [editableItems, onItemsChange]);

  const itemDetailsColumns: ColumnDef<any>[] = [
    {
      header: "SKU",
      accessorKey: "sku",
    },
    {
      header: "Quantity Plan",
      accessorKey: "qty_plan",
      cell: ({ row }) =>
        isEditMode && editingIndex === row.index ? (
          <input
            type="number"
            value={editableItems[row.index]?.qty_plan ?? ""}
            onChange={(e) => handleQtyChange(row.index, e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
        ) : (
          editableItems[row.index]?.qty_plan
        ),
    },
    {
      header: "UOM",
      accessorKey: "uom",
    },
    {
      header: "Classification",
      accessorKey: "classification_name",
    },
    ...(isEditMode
      ? [
          {
            id: "actions",
            header: "Action",
            cell: ({ row }: { row: { index: number } }) => (
              <div style={{ display: "flex", gap: 8 }}>
                {editingIndex === row.index ? (
                  <>
                    <button onClick={handleSaveRow}>
                      <Badge variant="solid" size="sm" color="success">
                        Save
                      </Badge>
                    </button>
                    <button onClick={() => setEditingIndex(null)}>
                      <Badge variant="solid" size="sm" color="warning">
                        Cancel
                      </Badge>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditRow(row.index)}>
                      <Badge variant="solid" size="sm" color="primary">
                        Edit
                      </Badge>
                    </button>
                    <button onClick={() => handleResetRow(row.index)}>
                      <Badge variant="solid" size="sm" color="warning">
                        Reset
                      </Badge>
                    </button>
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <TableComponent
        data={editableItems}
        columns={itemDetailsColumns}
        pageSize={5}
      />

      <ModalForm
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditModalSubmit}
        formFields={manualFormFields}
        defaultValues={editItemData || { sku: "", qty_plan: "" }}
        title="Edit Item"
        key={editItemIndex}
      />
    </>
  );
};

export default DetailInboundItem;
