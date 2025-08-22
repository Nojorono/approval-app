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
import axios from "axios";
import { EnPoint } from "../../../utils/EndPoint";
import axiosInstance from "../../../DynamicAPI/AxiosInstance";

const DataTable = () => {
  const {
    fetchAll: fetchApprovalProcess,
    list: testdata,
    isLoading,
  } = useStoreApprovalProcess();

  const { list: userList, fetchAll: fetchUsers } = useStoreUser();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const userDataString = localStorage.getItem("user_login_data");
  let userId: string | undefined = undefined;
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      userId = userData?.user?.id;
    } catch (e) {
      console.error("Failed to parse user_login_data:", e);
    }
  }

  useEffect(() => {
    fetchApprovalProcess();
    fetchUsers();
    if (userId) {
      fetchApprovalProcessByApprover(userId);
    }
  }, []);

  interface ApprovalProcessResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    approvalRequestId: string;
    approvalRequest: {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      code: string;
      subject: string;
      approverIds: string[];
      description: string;
      attachments: string[];
      status: string;
      createdBy: string | null;
      creator: null | {
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        username: string;
        email: string | null;
        phone: string | null;
        pin: string | null;
        password: string;
        isActive: boolean;
        role: {
          id: string;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
          name: string;
          description: string;
          isActive: boolean;
        };
        roleId: string;
      };
      frontendUrl: string;
    };
    approverId: string;
    status: string;
    reasonRejected: string | null;
  }

  const [approvalDataByApprover, setApprovalDataByApprover] = useState<any>();

  const fetchApprovalProcessByApprover = async (userId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(
      `${EnPoint}approval-process/by-approver/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // response.data bentuknya: { success, message, data, ... }
    const responseData = response.data;

    // Cek apakah responseData.data ada dan array
    if (Array.isArray(responseData.data)) {
      setApprovalDataByApprover(responseData.data);
      console.log("Approval Data By Approver:", responseData.data);
    } else {
      setApprovalDataByApprover([]);
      console.log("Approval Data By Approver: []");
    }
  };


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
        accessorKey: "approvalRequest.creator.username",
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
      name: "approvalRequest.creator.username",
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
          data={approvalDataByApprover}
          globalFilter={debouncedSearch}
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setCreateModalOpen(false)}
          columns={columns}
          formFields={formFields}
          onSubmit={handleCreate}
          onUpdate={handleUpdate}
          onDelete={async (id) => {

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
