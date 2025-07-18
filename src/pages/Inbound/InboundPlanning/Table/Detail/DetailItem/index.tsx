import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../../../../../components/toast";
import { ModalForm } from "../../../../../../components/modal/type";
import Badge from "../../../../../../components/ui/badge/Badge";
import { FaTrash } from "react-icons/fa";
import {
  useStoreClassification,
  useStoreItem,
} from "../../../../../../DynamicAPI/stores/Store/MasterStore";

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
  const { fetchAll, list: clsfData } = useStoreClassification();
  const { fetchAll: fetchItem, list: itemData } = useStoreItem();

  useEffect(() => {
    fetchAll();
    fetchItem();
  }, []);

  const [editableItems, setEditableItems] = useState<any[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [editItemData, setEditItemData] = useState<any>(null);

  console.log("clsfData", clsfData);
  console.log("data", data);

  const manualFormFields = [
    {
      name: "sku",
      label: "SKU",
      type: "select",
      options: [
        { label: "-- Select SKU --", value: "" },
        ...itemData.map((sku) => ({
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
        { label: "BAL", value: "BAL" },
      ],
    },
    {
      name: "classification_code",
      label: "Classification",
      type: "select",
      options: [
        { label: "-- Select Classification --", value: "" },
        ...clsfData.map((cls: any) => ({
          label: cls.classification_name,
          value: cls.classification_code,
        })),
      ],
    },
  ];

  // const handleDeleteRow = (index: number) => {
  //   const newItems = [...editableItems];
  //   newItems.splice(index, 1);
  //   setEditableItems(newItems);
  // };

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
    // Find item_id and classification_item_id based on selected sku and classification
    const selectedItem = itemData.find(
      (item: any) => item.sku === formData.sku
    );

    const selectedClassification = clsfData.find(
      (cls: any) => cls.classification_code === formData.classification_code
    );

    const submitData = {
      sku: formData.sku || "",
      item_id: selectedItem?.id || "",
      qty_plan: Number(formData.qty_plan) || 0,
      uom: formData.uom || "",
      classification_item_id: selectedClassification?.id || "",
    };

    if (editItemIndex !== null) {
      const newItems = [...editableItems];
      newItems[editItemIndex] = {
        ...newItems[editItemIndex],
        ...submitData,
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
