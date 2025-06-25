import { ColumnDef } from "@tanstack/react-table";

// 1. Item Details Table
export const itemDetailsData = [
  { SKU: "ITEM001", itemName: "Box A", quantity: 100, uom: "DUS" },
  { SKU: "ITEM002", itemName: "Box B", quantity: 50, uom: "DUS" },
  { SKU: "ITEM003", itemName: "Box C", quantity: 75, uom: "DUS" },
  { SKU: "ITEM004", itemName: "Box D", quantity: 120, uom: "DUS" },
  { SKU: "ITEM005", itemName: "Box E", quantity: 60, uom: "DUS" },
  { SKU: "ITEM006", itemName: "Box F", quantity: 90, uom: "DUS" },
  { SKU: "ITEM007", itemName: "Box G", quantity: 30, uom: "DUS" },
  { SKU: "ITEM008", itemName: "Box H", quantity: 110, uom: "DUS" },
  { SKU: "ITEM009", itemName: "Box I", quantity: 45, uom: "DUS" },
  // { SKU: "ITEM010", itemName: "Box J", quantity: 80, uom: "DUS" },
  // { SKU: "ITEM011", itemName: "Box K", quantity: 55, uom: "DUS" },
  // { SKU: "ITEM012", itemName: "Box L", quantity: 95, uom: "DUS" },
  // { SKU: "ITEM013", itemName: "Box M", quantity: 70, uom: "DUS" },
  // { SKU: "ITEM014", itemName: "Box N", quantity: 65, uom: "DUS" },
  // { SKU: "ITEM015", itemName: "Box O", quantity: 85, uom: "DUS" },
  // { SKU: "ITEM016", itemName: "Box P", quantity: 40, uom: "DUS" },
  // { SKU: "ITEM017", itemName: "Box Q", quantity: 105, uom: "DUS" },
  // { SKU: "ITEM018", itemName: "Box R", quantity: 35, uom: "DUS" },
  // { SKU: "ITEM019", itemName: "Box S", quantity: 125, uom: "DUS" },
  // { SKU: "ITEM020", itemName: "Box T", quantity: 60, uom: "DUS" },
  // { SKU: "ITEM021", itemName: "Box U", quantity: 77, uom: "DUS" },
  // { SKU: "ITEM022", itemName: "Box V", quantity: 88, uom: "DUS" },
  // { SKU: "ITEM023", itemName: "Box W", quantity: 99, uom: "DUS" },
  // { SKU: "ITEM024", itemName: "Box X", quantity: 66, uom: "DUS" },
  // { SKU: "ITEM025", itemName: "Box Y", quantity: 44, uom: "DUS" },
  // { SKU: "ITEM026", itemName: "Box Z", quantity: 33, uom: "DUS" },
  // { SKU: "ITEM027", itemName: "Box AA", quantity: 22, uom: "DUS" },
  // { SKU: "ITEM028", itemName: "Box AB", quantity: 11, uom: "DUS" },
  // { SKU: "ITEM029", itemName: "Box AC", quantity: 55, uom: "DUS" },
  // { SKU: "ITEM030", itemName: "Box AD", quantity: 100, uom: "DUS" },
];

export const itemDetailsColumns: ColumnDef<any>[] = [
  {
    header: "SKU",
    accessorKey: "SKU",
  },
  {
    header: "Item Name",
    accessorKey: "itemName",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "UOM",
    accessorKey: "uom",
  },
];

// 2. Transport & Loading Table
export const transportLoadingData = [
  { vehicleNo: "B 1234 CD", driver: "Andi", sealNo: "SEAL001" },
  { vehicleNo: "D 5678 EF", driver: "Budi", sealNo: "SEAL002" },
];

export const transportLoadingColumns: ColumnDef<any>[] = [
  {
    header: "Vehicle No",
    accessorKey: "vehicleNo",
  },
  {
    header: "Driver Name",
    accessorKey: "driver",
  },
  {
    header: "Seal Number",
    accessorKey: "sealNo",
  },
];

// 3. Scan History Table
export const scanHistoryData = [
  { scanId: "SCAN001", scannedBy: "Rina", timestamp: "2024-06-24 10:00" },
  { scanId: "SCAN002", scannedBy: "Doni", timestamp: "2024-06-24 10:15" },
];

export const scanHistoryColumns: ColumnDef<any>[] = [
  {
    header: "Scan ID",
    accessorKey: "scanId",
  },
  {
    header: "Scanned By",
    accessorKey: "scannedBy",
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
  },
];
