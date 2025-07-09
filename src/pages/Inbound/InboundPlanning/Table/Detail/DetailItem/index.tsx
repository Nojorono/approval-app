import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";

const DetailInboundItem = (data: any) => {  
  
  // // Mapping detail items for table usage
  const mappedItemDetails = (data.data || []).map((item: any) => ({
    sku: item.sku || "",
    item_name: item.name || "",
    qty_plan: item.qty_plan || 0,
    uom: item.uom || "",
    classification_name: item.classification_name || "",
  }));

  const itemDetailsColumns: ColumnDef<any>[] = [
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
      header: "Classification",
      accessorKey: "classification_name",
    },
  ];

  return (
    <>
      <TableComponent
        data={mappedItemDetails}
        columns={itemDetailsColumns}
        pageSize={5}
      />
    </>
  );
};

export default DetailInboundItem;
