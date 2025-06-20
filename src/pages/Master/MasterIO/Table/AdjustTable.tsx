import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../../components/ui/badge/Badge";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import Checkbox from "../../../../components/form/input/Checkbox";
import Button from "../../../../components/ui/button/Button";

type IOdata = {
  id: number;
  organization_id: string;
  organization_name: string;
  operating_unit: string;
};

type MenuTableProps = {
  data: IOdata[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (data: IOdata) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const columns: ColumnDef<IOdata>[] = useMemo(
    () => [
      {
        accessorKey: "organization_id",
        header: "organization_id",
      },
      {
        accessorKey: "organization_name",
        header: "organization_name",
      },
      {
        accessorKey: "operating_unit",
        header: "operating_unit",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onDetail && onDetail(row.original.id)}
          >
            <Badge variant="solid" size="sm" color="secondary">
              <FaEye />
              Show
            </Badge>
          </button>
        ),
      },
    ],
    [onDetail]
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
