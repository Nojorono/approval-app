import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Button from "../../../../components/ui/button/Button";
import { useDebounce } from "../../../../helper/useDebounce";
import DynamicTable from "../../../../components/wms-components/DynamicTable";
import { useStorePallet } from "../../../../DynamicAPI/store/Store/MasterStore";

const DataTable = () => {
  const {
    list: pallet,
    createData,
    updateData,
    deleteData,
    fetchAll,
  } = useStorePallet();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  // Fungsi untuk format payload create
  const handleCreate = (data: any) => {
    const formattedData = {
      ...data,
      organization_id: Number(data.organization_id),
      capacity: Number(data.capacity),
      isActive: data.isActive === "true" || data.isActive === true,
      isEmpty: data.isEmpty === "true" || data.isEmpty === true,
    };
    return createData(formattedData);
  };

  // Fungsi untuk format payload update
  const handleUpdate = (data: any) => {
    const { id, ...rest } = data;
    return updateData(id, {
      organization_id: Number(rest.organization_id),
      pallet_code: String(rest.pallet_code),
      uom_name: String(rest.uom_name),
      capacity: Number(rest.capacity),
      isActive: rest.isActive === "true" || rest.isActive === true,
      isEmpty: rest.isEmpty === "true" || rest.isEmpty === true,
    });
  };

  const columns = useMemo(
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
    ],
    []
  );

  const formFields = [
    {
      name: "organization_id",
      label: "Organization Id",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "pallet_code",
      label: "Pallet Code",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "uom_name",
      label: "UOM Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "Is Active",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
      validation: { required: "Required" },
    },
    {
      name: "isEmpty",
      label: "Is Empty",
      type: "select",
      options: [
        { label: "--Select--", value: "" },
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      validation: { required: "Required" },
    },
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
              <FaPlus className="mr-2" /> Tambah Data
            </Button>
          </div>
        </div>
      </div>

      <DynamicTable
        data={pallet}
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
        title="Form Data"
      />
    </>
  );
};

export default DataTable;
