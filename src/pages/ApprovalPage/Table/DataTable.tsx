import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useDebounce } from "../../../helper/useDebounce";
import DynamicTable from "../../../components/wms-components/DynamicTable";
import {
  useStoreUser,
  useStoreApprovalProcess,
} from "../../../DynamicAPI/stores/Store/MasterStore";
import ActIndicator from "../../../components/ui/activityIndicator";

const DataTable = () => {
  const {
    list: approvalListProcess,
    fetchAll: fetchApprovalProcess,
    deleteData,
    createData,
    updateData,
    isLoading,
  } = useStoreApprovalProcess();

  const { list: userList, fetchAll: fetchUsers } = useStoreUser();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchApprovalProcess();
    fetchUsers();
  }, []);


  const [selectedApprovers, setSelectedApprovers] = useState<string[] | null>(
    null
  );
  const [isApproverModalOpen, setApproverModalOpen] = useState(false);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleCreate = async (data: any): Promise<any> => {
    // Implement create logic here if needed
    return Promise.resolve();
  };

  const handleUpdate = async (data: any): Promise<any> => {
    // Implement update logic here if needed
    return Promise.resolve();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "approvalRequestId",
        header: "ID",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "requestor",
        header: "Requestor",
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
      },
    ],
    [expandedRow]
  );

  const formFields = [
    {
      name: "id",
      label: "ID",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "requestor",
      label: "From",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      validation: { required: "Required" },
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
      type: "custom",
      render: ({ value }: { value: FileList | File[] | null | undefined }) =>
        !value || (Array.isArray(value) && value.length === 0)
          ? <span>There is no data</span>
          : Array.isArray(value)
            ? value.map((file, idx) => <span key={idx}>{file.name}</span>)
            : Array.from(value as FileList).map((file, idx) => <span key={idx}>{file.name}</span>),
      parseValue: (value: FileList | File[] | null) =>
        value ? Array.from(value as FileList) : [],
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      validation: { required: "Required" },
    }
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
        </div>
      </div>

      {isLoading ? (
        <ActIndicator />
      ) : (
        <DynamicTable
          data={approvalListProcess}
          globalFilter={debouncedSearch}
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setCreateModalOpen(false)}
          columns={columns}
          formFields={formFields}
          onSubmit={handleCreate}
          onUpdate={handleUpdate}
          onDelete={async (id) => {
            // await deleteData(id);
          }}
          onRefresh={fetchApprovalProcess}
          getRowId={(row) => row.id}
          title="Approval Detail"
          viewOnly={true}
        />
      )}
    </>
  );
};

export default DataTable;
