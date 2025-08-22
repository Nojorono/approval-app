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
    console.log("Data fetched : ", approvalListProcess);
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
        accessorKey: "approvalRequest.code",
        header: "ID",
      },
      {
        accessorKey: "approvalRequest.subject",
        header: "Subject",
      },
       {
        accessorKey: "approvalRequest.createdBy",
        header: "Requestor",
      },
        {
        accessorKey: "status",
        header: "Status",
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
      name: "approvalRequest.code",
      label: "ID",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "approvalRequest.creator ?? approvalRequest.createdBy",
      label: "From",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "approvalRequest.subject",
      label: "Subject",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "approvalRequest.description",
      label: "Description",
      type: "textarea",
      validation: { required: "Required" },
    },
    {
      name: "approvalRequest.attachments",
      label: "Attachments",
      type: "multifile",
      render: ({ value }: { value: FileList | File[] | null | undefined }) => {
        let files: File[] = [];
        if (!value) {
          return <span>There is no data</span>;
        }
        if (Array.isArray(value)) {
          files = value;
        } else if (value instanceof FileList) {
          files = Array.from(value);
        }
        return files.length === 0
          ? <span>There is no data</span>
          : files.map((file, idx) => <span key={idx}>{file.name}</span>);
      },
      parseValue: (value: FileList | File[] | null | undefined) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (value instanceof FileList) return Array.from(value);
        return [];
      },
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "approvalRequest.reasonRejected",
      label: "Reason Rejected",
      type: "text",
      validation: { required: "Required" },
      shouldRender: (formValues: any) =>
        formValues?.approvalRequest?.reasonRejected != null &&
        formValues?.approvalRequest?.reasonRejected !== "",
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
          isDeleteDisabled={true}
        />
      )}
    </>
  );
};

export default DataTable;
