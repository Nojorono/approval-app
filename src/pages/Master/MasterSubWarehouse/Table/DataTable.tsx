import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Button from "../../../../components/ui/button/Button";
import { useDebounce } from "../../../../helper/useDebounce";
import DynamicTable from "../../../../components/wms-components/DynamicTable";
import {
  useStoreWarehouse,
  useStoreIo,
  useStoreSubWarehouse,
} from "../../../../DynamicAPI/stores/Store/MasterStore";

const DataTable = () => {
  const { list: Warehouse, fetchAll } = useStoreWarehouse();

  const { fetchAll: fetchAllIo, list: ioList } = useStoreIo();

  const {
    fetchAll: fetchSubWH,
    list: subWHList,
    createData,
    updateData,
    deleteData,
  } = useStoreSubWarehouse();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchAllIo();
    fetchSubWH();
  }, []);
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "organization_id",
        header: "Organization",
        cell: ({ row }: any) => {
          const org = ioList.find(
            (item: any) => item.organization_id === row.original.organization_id
          );
          return org ? org.organization_name : row.original.organization_id;
        },
      },
      {
        accessorKey: "warehouse_id",
        header: "Warehouse",
        cell: ({ row }: any) => {
          const wh = Warehouse.find(
            (item: any) => item.id === row.original.warehouse_id
          );
          return wh ? wh.name : row.original.warehouse_id;
        },
      },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "code", header: "Kode" },
      { accessorKey: "description", header: "Deskripsi" },
      { accessorKey: "capacity_bin", header: "Kapasitas Bin" },
    ],
    [ioList, Warehouse]
  );

  const formFields = [
    {
      name: "organization_id",
      label: "Organization",
      type: "select",
      options: ioList.map((item: any) => ({
        label: item.organization_name,
        value: item.organization_id,
      })),
      validation: { required: "Required" },
    },
    {
      name: "warehouse_id",
      label: "Warehouse",
      type: "select",
      options: Warehouse.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
      validation: { required: "Required" },
    },
    {
      name: "name",
      label: "Nama Gudang",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "code",
      label: "Kode",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "capacity_bin",
      label: "Kapasitas Bin",
      type: "number",
      validation: {
        required: "Required",
        min: { value: 0, message: "Harus >= 0" },
      },
    },
  ];

  // Fungsi untuk format payload create
  const handleCreate = (data: any) => {
    const {
      organization_id,
      warehouse_id,
      name,
      code,
      description,
      capacity_bin,
    } = data;
    return createData({
      organization_id: Number(organization_id),
      warehouse_id,
      name,
      code,
      description,
      capacity_bin: Number(capacity_bin),
    });
  };

  // Fungsi untuk format payload update
  const handleUpdate = (data: any) => {
    const {
      id,
      organization_id,
      warehouse_id,
      name,
      code,
      description,
      capacity_bin,
    } = data;
    return updateData(id, {
      organization_id: Number(organization_id),
      warehouse_id,
      name,
      code,
      description,
      capacity_bin: Number(capacity_bin),
    });
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="search">Search</Label>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Masukan data.."
            />
          </div>
          <div className="space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
            >
              <FaPlus className="mr-2" /> Tambah Data
            </Button>
          </div>
        </div>
      </div>

      <DynamicTable
        data={subWHList}
        globalFilter={debouncedSearch}
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setCreateModalOpen(false)}
        columns={columns}
        formFields={formFields}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        onDelete={async (id) => {
          await deleteData(id);
        }}
        onRefresh={fetchAll}
        getRowId={(row) => row.id}
        title="Form UOM"
      />
    </>
  );
};

export default DataTable;
