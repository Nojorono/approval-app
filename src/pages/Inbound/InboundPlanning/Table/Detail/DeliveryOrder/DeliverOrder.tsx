// import React, { useEffect, useMemo } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import {
//   useStoreInboundDeliveryOrder,
//   useStoreItem,
//   useStoreUom,
// } from "../../../../../../DynamicAPI/stores/Store/MasterStore";
// import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
// import ActIndicator from "../../../../../../components/ui/activityIndicator";

// const DeliveryOrder = (data: any) => {
//   const IdInbound = data.data.id;
//   const { fetchById, detail, isLoading } = useStoreInboundDeliveryOrder();
//   const { fetchAll, list: itemList } = useStoreItem();
//   const { fetchAll: fetchAllUom, list: uomList } = useStoreUom();

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchById(IdInbound);
//     };
//     fetchData();
//     fetchAll();
//     fetchAllUom();
//   }, [IdInbound]);

//   // Mapping detail for table usage
//   // const mappedDeliverOrder = useMemo(() => {
//   //   if (!detail || !Array.isArray(detail)) return [];
//   //   return detail.map((item: any) => ({
//   //     inbound_plan_id: item.inbound_plan_id || "",
//   //     inbound_transporter_id: item.inbound_transporter_id || "",
//   //     number_delivery_order: item.number_delivery_order || "",
//   //     items: Array.isArray(item.items)
//   //       ? item.items.map((itm: any) => {
//   //           const matchedItem = itemList.find((i: any) => i.id === itm.item_id);
//   //           const matchedUom = uomList.find((u: any) => u.id === itm.uom);
//   //           return {
//   //             inbound_delivery_order_id: itm.inbound_delivery_order_id || "",
//   //             item_id: itm.item_id || "",
//   //             sku: matchedItem ? matchedItem.sku : itm.item_id,
//   //             qty_plan: itm.qty_plan ?? 0,
//   //             uom: matchedUom ? matchedUom.name : itm.uom || "",
//   //           };
//   //         })
//   //       : [],
//   //     created_by: item.created_by || "",
//   //     updated_by: item.updated_by || "",
//   //   }));
//   // }, [detail]);

//   const mappedDeliverOrder = useMemo(() => {
//     if (!detail || !Array.isArray(detail)) return [];

//     const result: any[] = [];

//     detail.forEach((doData: any) => {
//       const {
//         number_delivery_order,
//         inbound_transporter_id,
//         inbound_plan_id,
//         created_by,
//         updated_by,
//         items,
//       } = doData;

//       if (Array.isArray(items)) {
//         items.forEach((itm: any, idx: number) => {
//           const matchedItem = itemList.find((i: any) => i.id === itm.item_id);
//           const matchedUom = uomList.find((u: any) => u.id === itm.uom);

//           result.push({
//             isGroupHeader: idx === 0, // Flag untuk baris group
//             number_delivery_order,
//             inbound_transporter_id,
//             inbound_plan_id,
//             created_by,
//             updated_by,
//             item_id: itm.item_id,
//             sku: matchedItem?.sku || itm.item_id,
//             qty_plan: itm.qty_plan ?? 0,
//             uom: matchedUom?.name || itm.uom || "",
//           });
//         });
//       }
//     });

//     return result;
//   }, [detail, itemList, uomList]);

//   // const transporterColumns: ColumnDef<any>[] = [
//   //   {
//   //     header: "Inbound Plan ID",
//   //     accessorKey: "inbound_plan_id",
//   //   },
//   //   {
//   //     header: "Transporter ID",
//   //     accessorKey: "inbound_transporter_id",
//   //   },
//   //   {
//   //     header: "Delivery Order Number",
//   //     accessorKey: "number_delivery_order",
//   //   },
//   //   {
//   //     header: "Created By",
//   //     accessorKey: "created_by",
//   //   },
//   //   {
//   //     header: "Updated By",
//   //     accessorKey: "updated_by",
//   //   },
//   //   // You may want to display items in a custom cell, since it's an array
//   //   {
//   //     header: "Items",
//   //     accessorKey: "items",
//   //     cell: ({ row }) => (
//   //       <ul>
//   //         {row.original.items.map((itm: any, idx: number) => {
//   //           const matchedItem = itemList.find((i: any) => i.id === itm.item_id);
//   //           return (
//   //             <li key={idx}>
//   //               {matchedItem ? matchedItem.sku : itm.item_id} - Qty:{" "}
//   //               {itm.qty_plan} {itm.uom}
//   //             </li>
//   //           );
//   //         })}
//   //       </ul>
//   //     ),
//   //   },
//   // ];

//   const transporterColumns: ColumnDef<any>[] = [
//     {
//       header: "SKU",
//       accessorKey: "sku",
//     },
//     {
//       header: "Qty Plan",
//       accessorKey: "qty_plan",
//     },
//     {
//       header: "UOM",
//       accessorKey: "uom",
//     },
//   ];

//   return (
//     <>
//       {isLoading || detail == null ? (
//         <ActIndicator />
//       ) : (
//         <>
//           {/* <TableComponent
//             data={mappedDeliverOrder}
//             columns={transporterColumns}
//             pageSize={5}
//           /> */}
//           return (
//           <>
//             {isLoading || !mappedDeliverOrder.length ? (
//               <ActIndicator />
//             ) : (
//               <div className="border rounded overflow-hidden">
//                 <table className="w-full table-auto text-sm">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-2 py-1 text-left">SKU</th>
//                       <th className="px-2 py-1 text-left">Qty Plan</th>
//                       <th className="px-2 py-1 text-left">UOM</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {mappedDeliverOrder.map((row, idx) => (
//                       <>
//                         {row.isGroupHeader && (
//                           <tr
//                             key={`group-${idx}`}
//                             className="bg-blue-50 font-semibold"
//                           >
//                             <td colSpan={3} className="px-2 py-2">
//                               DO: {row.number_delivery_order} | Transporter:{" "}
//                               {row.inbound_transporter_id} | Plan ID:{" "}
//                               {row.inbound_plan_id}
//                             </td>
//                           </tr>
//                         )}
//                         <tr key={`item-${idx}`} className="border-b">
//                           <td className="px-2 py-1">{row.sku}</td>
//                           <td className="px-2 py-1">{row.qty_plan}</td>
//                           <td className="px-2 py-1">{row.uom}</td>
//                         </tr>
//                       </>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//           );
//         </>
//       )}
//     </>
//   );
// };

// export default DeliveryOrder;

import React, { useEffect, useMemo } from "react";
import {
  useStoreInboundDeliveryOrder,
  useStoreItem,
  useStoreUom,
} from "../../../../../../DynamicAPI/stores/Store/MasterStore";
import ActIndicator from "../../../../../../components/ui/activityIndicator";

const DeliveryOrder = ({ data }: any) => {
  const IdInbound = data?.id;
  const { fetchById, detail, isLoading } = useStoreInboundDeliveryOrder();
  const { fetchAll, list: itemList } = useStoreItem();
  const { fetchAll: fetchAllUom, list: uomList } = useStoreUom();

  useEffect(() => {
    const fetchData = async () => {
      await fetchById(IdInbound);
      fetchAll();
      fetchAllUom();
    };
    fetchData();
  }, [IdInbound]);

  // Grouped data by delivery order number
  const groupedData = useMemo(() => {
    if (!detail || !Array.isArray(detail)) return [];
    
    return detail.map((doData: any) => {
      const {
        number_delivery_order,
        inbound_transporter_id,
        inbound_plan_id,
        created_by,
        updated_by,
        items,
      } = doData;

      const mappedItems = (items || []).map((itm: any) => {
        const matchedItem = itemList.find((i: any) => i.id === itm.item_id);
        const matchedUom = uomList.find((u: any) => u.id === Number(itm.uom));

        return {
          item_id: itm.item_id,
          sku: matchedItem?.sku || itm.item_id,
          qty_plan: itm.qty_plan ?? 0,
          uom: matchedUom?.name || "",
        };
      });

      return {
        number_delivery_order,
        inbound_transporter_id,
        inbound_plan_id,
        created_by,
        updated_by,
        items: mappedItems,
      };
    });
  }, [detail, itemList, uomList]);

  if (isLoading || !groupedData.length) return <ActIndicator />;

  return (
    <div className="space-y-4">
      {groupedData.map((group: any, index: number) => (
        <div key={index} className="border rounded">
          <div className="bg-blue-50 px-3 py-2 font-semibold">
            DO: {group.number_delivery_order}
          </div>
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">SKU</th>
                <th className="px-2 py-1 text-left">QTY</th>
                <th className="px-2 py-1 text-left">UOM</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="px-2 py-1">{item.sku}</td>
                  <td className="px-2 py-1">{item.qty_plan}</td>
                  <td className="px-2 py-1">{item.uom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DeliveryOrder;
