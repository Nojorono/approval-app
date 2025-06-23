import React, { useState, useMemo, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import TabsSection from "../../../components/wms-components/inbound-component/tabs/TabsSection";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "../../../components/ui/badge/Badge";
import { FaTrash } from "react-icons/fa";
import ItemTable from "../../../components/wms-components/inbound-component/table/ItemTable";
import { set, useForm } from "react-hook-form";

import DynamicForm, {
  FieldConfig,
} from "../../../components/wms-components/inbound-component/form/DynamicForm";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import { showErrorToast, showSuccessToast } from "../../../components/toast";

const InboundPlanningAdd = () => {
  const methods = useForm();
  const { setValue } = methods;

  const [poList, setPoList] = useState<any[]>([]);
  const [poNoInput, setPoNoInput] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const selectedPO = poList[0] || {};
  const [isLoading, setIsLoading] = useState(false);

  const [editableItems, setEditableItems] = useState<any[]>([]);

  const fetchPoDetail = async (poNo: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/po_detail?po_no=${encodeURIComponent(poNo)}`
      );
      const json = await res.json();

      // Kondisi jika response negatif (misal: tidak ada data atau error)
      if (!res.ok || !json || json.length === 0) {
        showErrorToast("PO tidak ditemukan atau terjadi kesalahan.");
        setPoList([]);
        setEditableItems([]);
        setValue("inbound_no", "");
        setValue("supplier_name", "");
        setValue("supplier_address", "");
        return;
      }
      showSuccessToast("Data PO Ditemukan.");
      setPoList(json);

      const firstPO = json[0];
      if (firstPO) {
        setValue("inbound_no", "Auto-generated-inbound-no");
        setValue("supplier_name", firstPO.NAMA_VENDOR || "");
        setValue("supplier_address", firstPO.ALAMAT_VENDOR || "");

        // Set editable items
        setEditableItems(firstPO.ITEM || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (formData: any) => {
    console.log("editableItems:", editableItems);

    const payload = {
      // inbound_no: formData.inbound_no || "",
      po_no: poNoInput,
      receipt_no: formData.receipt_no || "",
      supplier_name: formData.supplier_name || "",
      supplier_address: formData.supplier_address || "",
      plan_date: formData.plan_date
        ? new Date(formData.plan_date).toISOString().split("T")[0]
        : null,
      order_type: formData.order_type?.value || null,
      receive_type: formData.receive_type?.value || null,
      warehouse_name: formData.warehouse_name?.value || null,
      tab: activeTab,
      items: editableItems.map((item: any) => ({
        SKU: item.SKU,
        DESKRIPSI_ITEM_LINE_PO: item.DESKRIPSI_ITEM_LINE_PO,
        UOM: item.UOM,
        PO_LINE_QUANTITY: item.PO_LINE_QUANTITY,
        classification: item.classification,
        expired_date: item.expired_date
          ? new Date(item.expired_date).toISOString().split("T")[0]
          : null,
      })),
      notes: formData.notes || "",
      attachments: formData.attachments || [],
    };

    console.log("Full Payload:", payload);
  };

  // COLUMN TABLE
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      { accessorKey: "SKU", header: "SKU No" },
      { accessorKey: "DESKRIPSI_ITEM_LINE_PO", header: "Item Name" },
      { accessorKey: "UOM", header: "UOM" },
      {
        accessorKey: "expired_date",
        header: "Expired Date",
        cell: ({ row }) => {
          const index = row.index;
          return (
            <DatePicker
              id={`expired_date-${index}`}
              label=""
              defaultDate={editableItems[index]?.expired_date}
              readOnly={false}
              onChange={([date]: Date[]) => {
                const newItems = [...editableItems];
                if (!newItems[index]) newItems[index] = {};
                newItems[index].expired_date = date;
                setEditableItems(newItems);
              }}
            />
          );
        },
      },
      {
        accessorKey: "PO_LINE_QUANTITY",
        header: "QTY Plan",
        // cell: ({ row }) => {
        //   const index = row.index;
        //   return (
        //     <input
        //       type="number"
        //       value={editableItems[index]?.PO_LINE_QUANTITY || ""}
        //       onChange={(e) => {
        //         const newItems = [...editableItems];
        //         newItems[index].PO_LINE_QUANTITY = Number(e.target.value);
        //         setEditableItems(newItems);
        //       }}
        //       className="border px-2 py-1 rounded w-20"
        //     />
        //   );
        // },
      },
      {
        accessorKey: "classification",
        header: "Classification",
        cell: ({ row }) => {
          const index = row.index;
          return (
            <select
              value={editableItems[index]?.classification || ""}
              onChange={(e) => {
                const newItems = [...editableItems];
                if (!newItems[index]) newItems[index] = {};
                newItems[index].classification = e.target.value;
                setEditableItems(newItems);
              }}
              className="border px-2 py-1 rounded"
            >
              <option value="">-- Select --</option>
              <option value="selling">Selling Item</option>
              <option value="raw">Raw Material</option>
            </select>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <button onClick={() => handleDeleteRow(rowData)}>
              <Badge variant="solid" size="sm" color="error">
                <FaTrash /> Delete
              </Badge>
            </button>
          );
        },
      },
    ],
    []
  );

  // FORM FIELD CONFIG
  const fields: FieldConfig[] = [
    {
      name: "inbound_no",
      label: "Inbound Planning No",
      type: "text",
      disabled: true,
    },
    {
      name: "supplier_name",
      label: "Supplier Name",
      type: "text",
      disabled: true,
    },

    {
      name: "supplier_address",
      label: "Supplier Address",
      type: "text",
      disabled: true,
    },
    {
      name: "po_no",
      label: "PO No*",
      type: "custom",
      element: (
        <>
          <input
            value={poNoInput}
            onChange={(e) => setPoNoInput(e.target.value)}
            className="w-full px-3 py-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={() => fetchPoDetail(poNoInput)}
            className={`px-2 py-1 rounded-lg text-white ${
              isLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "..." : "🔍"}
          </button>
        </>
      ),
    },
    { name: "receipt_no", label: "Receipt No*", type: "text" },
    {
      name: "order_type",
      label: "Order Type*",
      type: "select",
      options: [
        { label: "-- Order Type --", value: "" },
        { label: "PO", value: "po" },
        { label: "Transfer", value: "transfer" },
      ],
    },
    {
      name: "warehouse_name",
      label: "Warehouse Name*",
      type: "select",
      options: [
        { label: "-- Select Warehouse --", value: "" },
        { label: "Gudang A", value: "gudang_a" },
        { label: "Gudang B", value: "gudang_b" },
        { label: "Gudang C", value: "gudang_c" },
      ],
    },
    {
      name: "plan_date",
      label: "Plan Delivery Date*",
      type: "date",
    },
    {
      name: "receive_type",
      label: "Receive Type*",
      type: "select",
      options: [
        { label: "-- Select Type --", value: "" },
        { value: "single_receive", label: "Single Receive" },
        { value: "partial_receive", label: "Partial Receive" },
      ],
    },
    {
      name: "attachments",
      label: "Attachment",
      type: "file",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
    },
  ];

  const handleDeleteRow = (rowData: any) => {
    alert("Delete row:" + JSON.stringify(rowData));
  };

  const handleSubmit = async (formData: any) => {
    console.log("Form Data:", formData);
  };

  return (
    <div>
      <div>
        <PageBreadcrumb
          breadcrumbs={[
            { title: "Inbound Planning", path: "/inbound_planning" },
            { title: "Create Inbound Planning" },
          ]}
        />

        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={{}} // jika ada
          control={methods.control}
          register={methods.register}
          setValue={methods.setValue}
          handleSubmit={methods.handleSubmit}
        />

        <div className="mt-6 mb-4">
          <TabsSection
            tabs={[
              {
                label: "Item Details",
                content: (
                  <>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></span>
                        <span className="ml-3 text-orange-600 font-semibold">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <ItemTable
                        data={selectedPO.ITEM || []}
                        columns={columns}
                      />
                    )}
                  </>
                ),
              },

              {
                label: "Notes",
                content: (
                  <textarea
                    className="w-full border rounded p-2 min-h-[100px]"
                    placeholder="Enter notes here..."
                    {...methods.register("notes")}
                  />
                ),
              },

              {
                label: "History",
                content: (
                  <div className="text-gray-500">
                    <p>No history available yet.</p>
                  </div>
                ),
              },

              {
                label: "Attachment",
                content: (
                  <input
                    type="file"
                    multiple
                    accept="*"
                    className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 3) {
                        alert("You can only upload up to 3 files.");
                        e.target.value = "";
                        return;
                      }
                      methods.setValue("attachments", files);
                    }}
                  />
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            variant="primary"
            size="md"
            onClick={methods.handleSubmit(onSubmit)}
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InboundPlanningAdd;
