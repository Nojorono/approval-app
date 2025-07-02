import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useStoreInboundPlanning,
  useStoreCheckerAssign,
} from "../../../../../DynamicAPI/stores/Store/MasterStore";
import TableComponent from "../../../../../components/tables/MasterDataTable/TableComponent";
import ActIndicator from "../../../../../components/ui/activityIndicator";

const DetailInboundItem = (data: any) => {
  const IdInbound = data.data.id;

  const { fetchById, detail, isLoading } = useStoreInboundPlanning();

  useEffect(() => {
    const fetchData = async () => {
      await fetchById(IdInbound);
    };

    fetchData();
  }, [IdInbound]);

  const { items = [] } = detail || {};

  // Mapping detail items for table usage
  const mappedItemDetails = items.map((item: any) => ({
    sku: item?.item?.sku || "",
    item_name: item?.item?.name || "",
    inbound_plan_id: detail?.id || "",
    expired_date: item?.expired_date || "",
    qty_plan: Number(item?.qty_plan ?? 0),
    uom: item?.uom || "",
    classification_name: item?.classification_item?.classification_name || "",
    plan_status: detail?.plan_status || "",
  }));

  const itemDetailsColumns: ColumnDef<any>[] = [
    // {
    //   header: "Status",
    //   accessorKey: "plan_status",
    // },
    {
      header: "SKU",
      accessorKey: "sku",
    },
    {
      header: "Item Name",
      accessorKey: "item_name",
    },
    {
      header: "Quantity Plan",
      accessorKey: "qty_plan",
    },
    {
      header: "UOM",
      accessorKey: "uom",
    },
    {
      header: "Expired Date",
      accessorKey: "expired_date",
    },
    {
      header: "Classification",
      accessorKey: "classification_name",
    },
  ];

  return (
    <>
      {isLoading ? (
        <ActIndicator />
      ) : (
        <TableComponent
          data={mappedItemDetails}
          columns={itemDetailsColumns}
          pageSize={5}
        />
      )}
    </>
  );
};

export default DetailInboundItem;
