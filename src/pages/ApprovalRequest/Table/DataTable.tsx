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
  useStoreApprovalRequestWithRelations,
} from "../../../DynamicAPI/stores/Store/MasterStore";
import ActIndicator from "../../../components/ui/activityIndicator";

const DataTable = () => {
  const {
    list: approvalList,
    fetchAll: fetchApproval,
    createData,
    updateData,
    deleteData,
    isLoading,
  } = useStoreApprovalRequest();

  const { list: userList, fetchAll: fetchUsers } = useStoreUser();

  const { list: approvalListRaw, fetchAll: fetchApprovalRaw } =
    useStoreApprovalRequestWithRelations();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchApproval();
    fetchUsers();
    fetchApprovalRaw();
  }, []);

  // Fungsi untuk format payload create
  const handleCreate = (data: any) => {
    const formattedData = {
      subject: data.subject,
      approverIds: Array.isArray(data.approverIds)
        ? data.approverIds
        : data.approverIds
        ? [data.approverIds]
        : [],
      description: data.description,
      attachments: Array.isArray(data.attachments)
        ? data.attachments
        : data.attachments
        ? [data.attachments]
        : [],
      status: "pending",
      createdBy: "",
    };

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

  const [selectedApprovers, setSelectedApprovers] = useState<string[] | null>(
    null
  );
  const [isApproverModalOpen, setApproverModalOpen] = useState(false);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: { row: { original: { status: string } } }) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              row.original.status === "approved"
                ? "bg-green-100 text-green-700"
                : row.original.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "approverIds",
        header: "Approvers",
        cell: ({ row, getValue }: any) => {
          const value = getValue();
          // value is now array of objects, show usernames
          return (
            <div className="flex items-center">
              <button
                onClick={() => row.toggleExpanded()}
                className="mr-2 text-blue-600"
                aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
              >
                {row.getIsExpanded() ? "▼" : "▶"}
              </button>
              {Array.isArray(value)
                ? value.map((v: any) => v?.username).join(", ")
                : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "attachments",
        header: "Attachments",
        cell: (info: any) => {
          const value = info.getValue();
          return Array.isArray(value) ? value.join(", ") : "-";
        },
      },
    ],
    [expandedRow]
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
      placeholder: "Select one or more user as approver",
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

  const approvalRaw = useMemo(() => {
    const raw = approvalListRaw as any;

    if (!raw || !Array.isArray(raw.data)) return [];

    return raw.data.map((item: any) => {
      const approval = item.approvalRequest;

      return {
        ...approval,
        notificationTracks: item.notificationTracks || [],
        approvalProcess: item.approvalProcess || null,
        approvers: (item.notificationTracks || []).map((track: any) => ({
          name: track.user?.username || "Unknown User",
          channel: track.channel || "-",
          status: track.status || "pending",
          note: track.note || "", // misalnya ada catatan
          updatedAt: track.updatedAt, // bisa buat timestamp approval
        })),
      };
    });
  }, [approvalListRaw]);

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

      {isLoading ? (
        <ActIndicator />
      ) : (
        <DynamicTable
          data={approvalRaw}
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
      )}
    </>
  );
};

export default DataTable;
