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

   const handleCreate = (data: any) => {
    // const formattedData = {
    //   subject: data.subject,
    //   approverIds: Array.isArray(data.approverIds)
    //     ? data.approverIds
    //     : data.approverIds
    //     ? [data.approverIds]
    //     : [],
    //   description: data.description,
    //   attachments: Array.isArray(data.attachments)
    //     ? data.attachments
    //     : data.attachments
    //     ? [data.attachments]
    //     : [],
    //   status: "pending",
    //   createdBy: "",
    // };

    return createData(data);
    
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
        // cell: ({ row }: { row: { original: { status: string } } }) => (
          // <span
          //   className={`px-2 py-1 rounded text-xs font-medium ${
          //     row.original.status === "approved"
          //       ? "bg-green-100 text-green-700"
          //       : row.original.status === "rejected"
          //       ? "bg-red-100 text-red-700"
          //       : "bg-yellow-100 text-yellow-700"
          //   }`}
          // >
          //   {row.original.status}
          // </span>
        // ),
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
      },
    ],
    [expandedRow]
  );

  // // Modal Approver
  // const ApproverModal = () =>
  //   isApproverModalOpen && (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
  //       <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
  //         <h3 className="text-lg font-semibold mb-4">Daftar Approver</h3>
  //         <ul className="mb-4">
  //           {(selectedApprovers || []).length === 0 ? (
  //             <li className="text-gray-500">Tidak ada approver</li>
  //           ) : (
  //             (selectedApprovers || []).map((approver: any, idx: number) => (
  //               <li key={idx} className="mb-2">
  //                 <span className="font-medium">
  //                   {approver.name || approver}
  //                 </span>
  //                 {approver.status && (
  //                   <span
  //                     className="ml-2 text-xs px-2 py-1 rounded 
  //                     bg-gray-100 text-gray-700"
  //                   >
  //                     {approver.status}
  //                   </span>
  //                 )}
  //               </li>
  //             ))
  //           )}
  //         </ul>
  //         <Button
  //           variant="primary"
  //           size="sm"
  //           onClick={() => setApproverModalOpen(false)}
  //         >
  //           Tutup
  //         </Button>
  //       </div>
  //     </div>
  //   );

  const formFields = [
    {
      name: "id",
      label: "ID",
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
      name: "requestor",
      label: "Requestor",
      type: "text",
      validation: { required: "Required" },
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
          title="Form Data"
        />
      )}
    </>
  );
};

export default DataTable;
