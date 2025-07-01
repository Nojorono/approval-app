import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import TabsSection from "../../../../components/wms-components/inbound-component/tabs/TabsSection";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "../../../../components/ui/badge/Badge";
import { FaTrash } from "react-icons/fa";
import ItemTable from "../../../../components/wms-components/inbound-component/table/ItemTable";
import { useForm } from "react-hook-form";
import DynamicForm, {
  FieldConfig,
} from "../../../../components/wms-components/inbound-component/form/DynamicForm";
import DatePicker from "../../../../components/form/date-picker";
import Button from "../../../../components/ui/button/Button";
import { showErrorToast, showSuccessToast } from "../../../../components/toast";
import {
  useStoreInboundPlanning,
  useStoreClassification,
} from "../../../../DynamicAPI/stores/Store/MasterStore";
import {
  InboundPlanningItemCreate,
  CreateInboundPlanning,
} from "../../../../DynamicAPI/types/InboundPlanningTypes";

const InboundPlanningAdd = () => {
  const navigate = useNavigate();

  const { createData } = useStoreInboundPlanning();
  const { fetchAll, list: clsData } = useStoreClassification();

  const methods = useForm();
  const { setValue } = methods;

  const [poList, setPoList] = useState<any[]>([]);
  const [poNoInput, setPoNoInput] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editableItems, setEditableItems] = useState<any[]>([]);

  const selectedPO = poList[0] || {};

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchPoDetail = async (poNo: string) => {
    setPoList([]);
    setEditableItems([]);
    setValue("inbound_no", "");
    setValue("supplier_name", "");
    setValue("supplier_address", "");

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/po_detail?po_no=${encodeURIComponent(poNo)}`
      );
      const json = await res.json();

      if (!res.ok || !json || json.length === 0) {
        showErrorToast("PO tidak ditemukan atau terjadi kesalahan.");
        return;
      }
      showSuccessToast("Data PO Ditemukan.");
      setPoList(json);

      const firstPO = json[0];
      if (firstPO) {
        setValue("inbound_no", "Auto-generated-inbound-no");
        setValue("supplier_name", firstPO.NAMA_VENDOR || "");
        setValue("supplier_address", firstPO.ALAMAT_VENDOR || "");

        // setEditableItems(
        //   firstPO.ITEM.map((item: any) => ({
        //     ...item,
        //     expired_date: null,
        //     classification: "",
        //     PO_LINE_QUANTITY: Number(item.PO_LINE_QUANTITY || 0),
        //   }))
        // );

        setEditableItems(
          firstPO.ITEM.map((item: any) => ({
            ...item,
            expired_date: null,
            classification: "",
            PO_LINE_QUANTITY: String(item.PO_LINE_QUANTITY || "0"),
          }))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (formData: any) => {
    const payload: CreateInboundPlanning = {
      inbound_planning_no: "", // generate jika perlu
      organization_id: 1,
      delivery_no: formData.receipt_no || "",
      po_no: poNoInput,
      client_name: formData.supplier_name || "",
      order_type: formData.order_type.value || "",
      task_type: formData.receive_type.value || "",
      notes: formData.notes || "",
      supplier_id: String(selectedPO.ID_VENDOR) || "",
      warehouse_id: formData.warehouse_id.value || "",
      plan_delivery_date: formData.plan_date
        ? new Date(formData.plan_date).toISOString()
        : "",
      plan_status: "DRAFT", // atau dari state
      plan_type: "single", // atau dari pilihan
      items: editableItems.map(
        (item): InboundPlanningItemCreate => ({
          inbound_plan_id: "", // jika perlu generate backend
          sku: item.SKU || "",
          expired_date: item.expired_date
            ? new Date(item.expired_date).toISOString()
            : "",
          qty_plan: Number(item.PO_LINE_QUANTITY) || 0,
          uom: item.UOM || "",
          classification_item_id: item.classification || "",
        })
      ),
    };

    createData(payload);
    navigate("/inbound_planning");
  };

  const updateItemField = (index: number, field: string, value: any) => {
    const newItems = [...editableItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setEditableItems(newItems);
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      { accessorKey: "SKU", header: "SKU No" },
      { accessorKey: "DESKRIPSI_ITEM_LINE_PO", header: "Item Name" },
      { accessorKey: "UOM", header: "UOM" },
      {
        accessorKey: "expired_date",
        header: "Expired Date",
        cell: ({ row }) => (
          <DatePicker
            id={`expired-${row.index}`}
            label=""
            defaultDate={editableItems[row.index]?.expired_date}
            readOnly={false}
            onChange={([date]: Date[]) =>
              updateItemField(row.index, "expired_date", date)
            }
          />
        ),
      },
      {
        accessorKey: "PO_LINE_QUANTITY",
        header: "QTY Plan",
        cell: ({ row }) => {
          const defaultValue = editableItems[row.index]?.PO_LINE_QUANTITY ?? "";
          const [inputValue, setInputValue] = useState(defaultValue);

          // Sinkron saat row/index berubah
          useEffect(() => {
            setInputValue(editableItems[row.index]?.PO_LINE_QUANTITY ?? "");
          }, [row.index, editableItems]);

          const handleBlur = () => {
            updateItemField(row.index, "PO_LINE_QUANTITY", inputValue);
          };

          return (
            <input
              type="number"
              inputMode="numeric"
              value={inputValue}
              onInput={(e) =>
                setInputValue((e.target as HTMLInputElement).value)
              }
              onBlur={handleBlur}
              className="border px-2 py-1 rounded w-20"
            />
          );
        },
      },
      {
        accessorKey: "classification",
        header: "Classification",
        cell: ({ row }) => (
          <select
            value={editableItems[row.index]?.classification ?? ""}
            onChange={(e) =>
              updateItemField(row.index, "classification", e.target.value)
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Select --</option>
            {clsData.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.classification_name}
              </option>
            ))}
          </select>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <button onClick={() => handleDeleteRow(row.index)}>
            <Badge variant="solid" size="sm" color="error">
              <FaTrash /> Delete
            </Badge>
          </button>
        ),
      },
    ],
    [editableItems]
  );

  const handleDeleteRow = (index: number) => {
    const newItems = [...editableItems];
    newItems.splice(index, 1);
    setEditableItems(newItems);
  };

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
      label: "Reference No*",
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
        { label: "Regular", value: "regular" },
        { label: "Transfer Warehouse", value: "transfer_warehouse" },
      ],
    },
    {
      name: "warehouse_id",
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
      name: "receive_type",
      label: "Receive Type*",
      type: "select",
      options: [
        { label: "-- Select Type --", value: "" },
        { value: "single_receive", label: "Single Receive" },
        { value: "partial_receive", label: "Partial Receive" },
      ],
    },
    { name: "plan_date", label: "Plan Delivery Date*", type: "date" },
  ];

  return (
    <div>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Inbound Planning", path: "/inbound_planning" },
          { title: "Create Inbound Planning" },
        ]}
      />

      <DynamicForm
        fields={fields}
        onSubmit={methods.handleSubmit(onSubmit)}
        defaultValues={{}}
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
              content: isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></span>
                  <span className="ml-3 text-orange-600 font-semibold">
                    Loading...
                  </span>
                </div>
              ) : (
                <ItemTable data={editableItems} columns={columns} />
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
  );
};

export default InboundPlanningAdd;
