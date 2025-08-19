import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useStoreCheckerScan } from "../../../../../../DynamicAPI/stores/Store/MasterStore";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
import ActIndicator from "../../../../../../components/ui/activityIndicator";

const CheckerScan = (data: any) => {
  const IdInbound = data.data.id;
  const { fetchById, detail, isLoading } = useStoreCheckerScan();

  useEffect(() => {
    const fetchData = async () => {
      await fetchById(IdInbound);
    };

    fetchData();
  }, [IdInbound]);

  console.log("Checker Scan Detail Data:", detail);

  // Mapping detail for table usage sesuai skema CheckerScan
  const mappedCheckerScanDetail = useMemo(() => {
    if (!detail || !Array.isArray(detail)) return [];
    return detail.map((item: any) => ({
      id: item.id || "",
      inbound_transporter_id: item.inbound_transporter_id || "",
      organization_id: item.organization_id || "",
      inbound_plan_id: item.inbound_plan_id || "",
      inbound_delivery_order_id: item.inbound_delivery_order_id || "",
      checker_assign_id: item.checker_assign_id || "",
      actual_qty: item.actual_qty || 0,
      pallet_code: item.pallet_code || "",
      status: item.status || "",
      approved_by: item.approved_by || "",
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
    }));
  }, [detail]);

  // MAPPING TABLE
  const TableColumns: ColumnDef<any>[] = [
    {
      header: "Delivery Order ID",
      accessorKey: "inbound_delivery_order_id",
    },
    {
      header: "Checker Assign ID",
      accessorKey: "checker_assign_id",
    },
    {
      header: "Actual Qty",
      accessorKey: "actual_qty",
    },
    {
      header: "Pallet Code",
      accessorKey: "pallet_code",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Approved By",
      accessorKey: "approved_by",
    },
  ];

  return (
    <>
      {isLoading || detail == null ? (
        <ActIndicator />
      ) : (
        <>
          <TableComponent
            data={mappedCheckerScanDetail}
            columns={TableColumns}
            pageSize={5}
          />
        </>
      )}
    </>
  );
};

export default CheckerScan;
