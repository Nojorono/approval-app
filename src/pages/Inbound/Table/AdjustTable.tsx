import React, { useMemo, useState } from "react";
import { FaEye, FaCheck } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../components/tables/MasterDataTable/TableComponent";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { InboundPlanning } from "../../../DynamicAPI/types/InboundPlanning";
import { useNavigate } from "react-router-dom";

import TabModal from "../../../components/modal/type/ModalTab";
import { usePagePermissions } from "../../../utils/UserPermission/UserPagePermissions";
import FormModal from "../../../components/modal/type/ModalForm";

import { showErrorToast, showSuccessToast } from "../../../components/toast";

type MenuTableProps = {
  data: InboundPlanning[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id: number) => void;
  onRefresh?: () => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onRefresh,
}: MenuTableProps) => {
  const navigate = useNavigate();

  const columns: ColumnDef<InboundPlanning>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "inbound_planning_no",
        header: "Inbound Planning No",
      },
      {
        accessorKey: "plan_status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.plan_status;
          let color: "error" | "info" | undefined;
          if (status === "DRAFT") color = "error";
          else if (status === "IN_PROGRESS") color = "info";
          return (
            <Badge variant="light" color={color}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "client_name",
        header: "Client Name",
      },
      // {
      //   accessorKey: "warehouse_id",
      //   header: "Warehouse ID",
      //   cell: ({ row }) => row.original.warehouse_id ?? "",
      // },
      {
        accessorKey: "po_no",
        header: "PO No",
      },
      {
        accessorKey: "plan_delivery_date",
        header: "Plan Delivery Date",
      },
      {
        accessorKey: "order_type",
        header: "Order Type",
      },

      {
        accessorKey: "task_type",
        header: "Task Type",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const status = row.original.plan_status;
          if (status === "DRAFT") {
            return (
              <Button
                variant="primary"
                size="xsm"
                startIcon={<FaCheck className="size-2" />}
                onClick={() => {
                  handleConfirmInbound(row.original.id);
                }}
              >
                Confirm
              </Button>
            );
          }
          if (status === "IN_PROGRESS") {
            return (
              <Button
                variant="outline"
                size="xsm"
                onClick={() =>
                  handleModalTab(String(row.original.inbound_planning_no))
                }
                startIcon={<FaEye className="size-5" />}
              >
                Detail
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [onDetail]
  );

  const formFields = [
    {
      name: "inbound_plan_id",
      label: "Inbound Plan ID",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "checker_leader_id",
      label: "Checker Leader ID",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "checkers",
      label: "Checkers",
      type: "array",
      fields: [
        {
          name: "id",
          label: "Checker ID",
          type: "text",
          validation: { required: "Required" },
        },
        {
          name: "name",
          label: "Checker Name",
          type: "text",
          validation: { required: "Required" },
        },
      ],
      validation: { required: "At least one checker is required" },
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "assign_date_start",
      label: "Assign Date Start",
      type: "datetime-local",
      validation: { required: "Required" },
    },
    {
      name: "assign_date_finish",
      label: "Assign Date Finish",
      type: "datetime-local",
      validation: { required: "Required" },
    },
  ];

  const [openMdlTab, setOpenMdlTab] = useState(false);
  const [inboundPlanId, setInboundPlanId] = useState<string | null>(null);

  const handleModalTab = (id: string) => {
    navigate("/inbound_planning/detail", { state: { id } });
  };

  const onClose = () => {
    setOpenMdlTab(false);
  };

  const handleSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  const handleConfirmInbound = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://10.0.29.47:9005/inbound-plan/status-in-progress/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log("Confirm Inbound Result:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }
      if (onRefresh) {
        console.log("onRefresh called");
        onRefresh();
      }

      showSuccessToast("Inbound confirmed successfully!");
      // Optionally, show success message or refresh data here
    } catch (error: any) {
      // Handle error, e.g., show notification
      console.error("Error confirming inbound:", error.message || error);
      showErrorToast(
        error.message || "Failed to confirm inbound. Please try again."
      );
    }
  };

  return (
    <>
      <TableComponent
        data={data}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={onDetail}
        pageSize={5}
      />
    </>
  );
};

export default AdjustTable;
