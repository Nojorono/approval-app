import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../../components/ui/badge/Badge";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import Checkbox from "../../../../components/form/input/Checkbox";
import Button from "../../../../components/ui/button/Button";

type IOdata = {
  id: any;
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
          <button type="button" onClick={() => handleDetail(row.original)}>
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

  const handleDetail = async (data: any) => {
    console.log("Detail data:", data);

    // if (!data) return;
    // setSelectedUOM(data);
    // setIsModalOpen(true);
  };
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
