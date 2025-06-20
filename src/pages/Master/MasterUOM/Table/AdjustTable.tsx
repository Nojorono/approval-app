import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../../components/ui/badge/Badge";
import { useUomStore } from "../../../../API/store/MasterStore";
import ModalUpdate from "../../MasterUOM/Table/UpdateUOM";

type UOM = {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: string;
};

type MenuTableProps = {
  data: UOM[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (data: UOM) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const { fetchUomById, fetchUomData } = useUomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUOM, setSelectedUOM] = useState<any>(null);

  const columns: ColumnDef<UOM>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Kode UOM",
      },
      {
        accessorKey: "name",
        header: "Nama UOM",
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => {
          const isActive =
            getValue<boolean>() === true || getValue<string>() === "1";
          return isActive ? "Active" : "Inactive";
        },
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
    if (!data) return;
    setSelectedUOM(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ModalUpdate
        onRefresh={fetchUomData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        defaultValues={selectedUOM}
      />

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
