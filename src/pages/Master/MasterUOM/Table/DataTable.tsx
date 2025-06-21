import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Button from "../../../../components/ui/button/Button";
import { useDebounce } from "../../../../helper/useDebounce";
import DynamicTable from "../../../../components/wms-components/DynamicTable";
import { useUomStore } from "../../../../API/store/MasterStore";

const DataTable = () => {
  const { fetchUOM, uom, createUomData, updateUomData, deleteUomData } =
    useUomStore();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchUOM();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "code", header: "Kode UOM" },
      { accessorKey: "name", header: "Nama UOM" },
      { accessorKey: "description", header: "Deskripsi" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (cell: any) => (cell.getValue() ? "Active" : "Inactive"),
      },
    ],
    []
  );

  const formFields = [
    {
      name: "code",
      label: "Kode UOM",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "name",
      label: "Nama UOM",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "text",
      validation: { required: "Required" },
    },
    { name: "isActive", label: "", type: "checkbox" },
  ];

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
              <FaPlus className="mr-2" /> Tambah UOM
            </Button>
          </div>
        </div>
      </div>

      <DynamicTable
        data={uom.map((item) => ({
          ...item,
          isActive: Boolean(item.isActive),
        }))}
        globalFilter={debouncedSearch}
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setCreateModalOpen(false)}
        columns={columns}
        formFields={formFields}
        onSubmit={createUomData}
        onUpdate={(data) => {
          const { id, ...rest } = data;
          return updateUomData(id, { ...rest, isActive: !!rest.isActive });
        }}
        onDelete={deleteUomData}
        onRefresh={fetchUOM}
        getRowId={(row) => row.id}
        title="Form UOM"
      />
    </>
  );
};

export default DataTable;
