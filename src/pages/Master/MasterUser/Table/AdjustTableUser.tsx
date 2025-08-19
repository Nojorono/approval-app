import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import Badge from "../../../../components/ui/badge/Badge";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string;
  region_name: string;
  created_on: string;
  nik: string;
  nik_spv: string;
  is_active: string;
  is_sales: string;
  valid_to: string;
};

type MenuTableProps = {
  data: User[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: User) => void;
};

const MenuTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const { canUpdate, canDelete } = usePagePermissions();

  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // Handle case jika dateString kosong

    const date = new Date(dateString);

    // Ambil komponen tanggal
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const year = date.getFullYear();

    // Ambil komponen waktu
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Gabungkan dalam format yang diinginkan
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "nik",
        header: "NIK",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "region_name",
        header: "Region",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "is_sales",
        header: "Is Sales",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "created_on",
        header: "Created On",
        cell: (info) => formatDate(String(info.getValue())),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="space-x-4">
            <button onClick={() => onDetail(row.original.id)}>
              <Badge variant="solid" size="sm" color="secondary">
                <FaEye />
                Detail
              </Badge>
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onDetail, canUpdate, canDelete, onEdit]
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

export default MenuTable;
