import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../components/ui/badge/Badge";
import { usePagePermissions } from "../../../utils/UserPermission/UserPagePermissions";
import Checkbox from "../../../components/form/input/Checkbox";
import Button from "../../../components/ui/button/Button";

type Inbound = {
  id: number;
  inboundNo: string;
  clientName: string;
  warehouseName: string;
  poNo: string;
  planDate: string;
  orderType: string;
  status: string;
  taskType: string;
};

type MenuTableProps = {
  data: Inbound[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (data: Inbound) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const columns: ColumnDef<Inbound>[] = useMemo(
    () => [
      {
        accessorKey: "inboundNo",
        header: "Inbound Planning No",
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
      },
      {
        accessorKey: "warehouseName",
        header: "Warehouse Name",
      },
      {
        accessorKey: "poNo",
        header: "PO No",
      },
      {
        accessorKey: "planDate",
        header: "Plan Delivery Date",
      },
      {
        accessorKey: "orderType",
        header: "Order Type",
      },
      {
        accessorKey: "status",
        header: "Inbound Status",
      },
      {
        accessorKey: "taskType",
        header: "Task Type",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <button>
            <Badge variant="solid" size="sm" color="secondary">
              <FaEye />
              Show
            </Badge>
          </button>
        ),
      },
    ],
    []
  );

  return (
    <TableComponent
      data={data}
      columns={columns}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onDetail={onDetail}
    />
  );
};

export default AdjustTable;
