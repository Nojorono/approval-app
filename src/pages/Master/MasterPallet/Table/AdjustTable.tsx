import React, { useMemo } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../../components/ui/badge/Badge";
import ModalUpdateForm from "./UpdatePallet.tsx";
import { usePalletStore } from "../../../../API/store/MasterStore/masterPalletStore.ts";

type Pallet = {
  id: number;
  organization_id: number;
  pallet_code: string;
  uom_name: string;
  capacity: number;
  isActive: string;
  isEmpty: boolean;
};

type MenuTableProps = {
  data: Pallet[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (data: Pallet) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const { fetchPallet } = usePalletStore();
  const columns: ColumnDef<Pallet>[] = useMemo(
    () => [
      {
        accessorKey: "organization_id",
        header: "Organization ID",
      },
      {
        accessorKey: "pallet_code",
        header: "Pallet Code",
      },
      {
        accessorKey: "uom_name",
        header: "UOM NAME",
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
      },
      {
        accessorKey: "isActive",
        header: "Active",
      },
      {
        accessorKey: "isEmpty",
        header: "Is Empty",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="space-x-4">
            <ModalUpdateForm
              defaultValues={row.original}
              onRefresh={fetchPallet}
            />
            <button
              className="text-red-600"
              onClick={() => (onDelete ? onDelete(row.original.id) : "")}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <>
      <TableComponent
        data={data}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={onDetail}
      />
    </>
  );
};

export default AdjustTable;
