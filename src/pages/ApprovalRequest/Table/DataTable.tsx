import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useDebounce } from "../../../helper/useDebounce";
import DynamicTable from "../../../components/wms-components/DynamicTable";
import {
  useStoreApprovalRequest,
  useStoreUser,
} from "../../../DynamicAPI/stores/Store/MasterStore";

const DataTable = () => {
  const {
    list: approvalList,
    fetchAll: fetchApproval,
    createData,
    updateData,
    deleteData,
  } = useStoreApprovalRequest();

  const { list: userList, fetchAll: fetchUsers, fetchById, detail } = useStoreUser();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchApproval();
    fetchUsers();
  }, []);

  // Fungsi untuk format payload create
  const handleCreate = (data: any) => {
    const formattedData = {
      ...data,
      approverIds: Array.isArray(data.approverIds)
        ? data.approverIds
        : data.approverIds
        ? [data.approverIds]
        : [],
      attachments: Array.isArray(data.attachments)
        ? data.attachments
        : data.attachments
        ? [data.attachments]
        : [],
    };

    console.log("Formatted Create Data:", formattedData);
    return createData(formattedData);
  };

  // Fungsi untuk format payload update
  const handleUpdate = (data: any) => {
    const { id, ...rest } = data;
    return updateData(id, {
      ...rest,
      approverIds: Array.isArray(rest.approverIds)
        ? rest.approverIds
        : rest.approverIds
        ? [rest.approverIds]
        : [],
      attachments: Array.isArray(rest.attachments)
        ? rest.attachments
        : rest.attachments
        ? [rest.attachments]
        : [],
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "approverIds",
        header: "Approvers",
        cell: (info: any) => (info.getValue() as string[]).join(", "),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "attachments",
        header: "Attachments",
        cell: (info: any) => (info.getValue() as string[]).join(", "),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  );

  const formFields = [
    {
      name: "subject",
      label: "Subject",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "approverIds",
      label: "To",
      type: "multiselect",
      options: userList.map((user: any) => ({
        label: user.username,
        value: user.id,
      })),
      validation: { required: "Required" },
      helperText: "Pilih satu atau lebih user sebagai approver",
      parseValue: (value: string[] | string) =>
        Array.isArray(value) ? value : value ? [value] : [],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      validation: { required: "Required" },
    },
    {
      name: "attachments",
      label: "Attachments",
      type: "multifile",
      parseValue: (value: FileList | File[] | null) =>
        value ? Array.from(value as FileList) : [],
    },
  ];

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Search..."
              className="w-full sm:w-auto"
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Tambah Data
            </Button>
          </div>
        </div>
      </div>

      <DynamicTable
        data={approvalList}
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
        onRefresh={fetchApproval}
        getRowId={(row) => row.id}
        title="Form Data"
      />
    </>
  );
};

export default DataTable;
