import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import TabsSection from "../../../../../components/wms-components/inbound-component/tabs/TabsSection";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "../../../../../components/ui/badge/Badge";
import { FaTrash } from "react-icons/fa";
import ItemTable from "../../../../../components/wms-components/inbound-component/table/ItemTable";
import { FormProvider, useForm } from "react-hook-form";
import DynamicForm, {
  FieldConfig,
} from "../../../../../components/wms-components/inbound-component/form/DynamicForm";
import Button from "../../../../../components/ui/button/Button";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../../components/toast";
import {
  useStoreInboundPlanning,
  useStoreClassification,
  useStoreItem,
  useStoreSource,
  useStoreUom,
} from "../../../../../DynamicAPI/stores/Store/MasterStore";
import {
  InboundPlanningItemCreate,
  CreateInboundPlanning,
} from "../../../../../DynamicAPI/types/InboundPlanningTypes";
import ActIndicator from "../../../../../components/ui/activityIndicator";
import { ModalForm } from "../../../../../components/modal/type";
import { toLocalISOString } from "../../../../../helper/FormatDate";
import Swal from "sweetalert2";

const InboundPlanningAdd = () => {
  const navigate = useNavigate();
  const { createData, error } = useStoreInboundPlanning();
  const { fetchAll, list: clsData } = useStoreClassification();
  const { fetchAll: fetchSKU, list: SKUList } = useStoreItem();
  const { fetchAll: fetchSource, list: sourceList } = useStoreSource();
  const { fetchAll: fetchUom, list: uomData } = useStoreUom();

  const methods = useForm();
  const { setValue } = methods;

  const [poList, setPoList] = useState<any[]>([]);
  const [poNoInput, setPoNoInput] = useState("");
  const [soNoInput, setSoNoInput] = useState("");

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const selectedPO = poList[0] || {};

  useEffect(() => {
    fetchAll();
    fetchSKU();
    fetchSource();
    fetchUom();
  }, []);

  // FETCH PO DETAIL
  const fetchPoDetail = async (poNo: string) => {
    setPoList([]);
    setEditableItems([]);
    setValue("inbound_no", "");
    setValue("supplier_name", "");
    setValue("supplier_address", "");
    setValue("prin_group", "PRIN_GROUP Tidak Ada");
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/v1/purchase-order?nomorPO=${encodeURIComponent(poNo)}`
      );
      const json = await res.json();

      // Handle new response structure
      const poData =
        json?.data?.data?.length > 0
          ? json.data.data
          : Array.isArray(json)
          ? json
          : [];

      if (!res.ok || !poData || poData.length === 0) {
        showErrorToast("PO tidak ditemukan atau terjadi kesalahan.");
        return;
      }
      showSuccessToast("Data PO Ditemukan.");
      setPoList(poData);

      const firstPO = poData[0];
      if (firstPO) {
        setValue("inbound_no", "Auto-generated-inbound-no");
        setValue("supplier_name", firstPO.NAMA_VENDOR || "");
        setValue("supplier_address", firstPO.ALAMAT_VENDOR || "");
        setValue("prin_group", firstPO.PRIN_GROUP || "PRIN_GROUP Tidak Ada");

        setEditableItems(
          (firstPO.ITEM || []).map((item: any) => ({
            ...item,
            expired_date: null,
            classification: "",
            PO_LINE_QUANTITY: String(item.PO_LINE_QUANTITY ?? "0"),
          }))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH SO DETAIL
  const fetchSoDetail = async (soNo: string) => {
    setPoList([]);
    setEditableItems([]);
    setValue("inbound_no", "");
    setValue("supplier_name", "");
    setValue("supplier_address", "");
    setValue("so_type", "");
    setValue("prin_group", "PRIN_GROUP Tidak Ada");
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/v1/sales-order?order_number=${encodeURIComponent(soNo)}`
      );
      const json = await res.json();

      // Handle new response structure
      const soData =
        json?.data?.data?.length > 0
          ? json.data.data
          : Array.isArray(json)
          ? json
          : [];


      if (!res.ok || !soData || soData.length === 0) {
        showErrorToast("SO tidak ditemukan atau terjadi kesalahan.");
        return;
      }
      showSuccessToast("Data SO Ditemukan.");
      setPoList(soData);

      const firstSO = soData[0];
      if (firstSO) {
        setValue("inbound_no", "Auto-generated-inbound-no");
        setValue("supplier_name", firstSO.SUBINVENTORY_TO || "");
        setValue("supplier_address", firstSO.INVOICE_TO_ADDRESS1 || "");
        setValue("so_type", firstSO.SO_TYPE || "");
        setValue("prin_group", firstSO.PRIN_GROUP || "PRIN_GROUP Tidak Ada");

        setEditableItems(
          (firstSO.ITEM || []).map((item: any) => ({
            SKU: item.ITEM_CODE || "",
            KODE_ITEM: item.ITEM_NUMBER || "",
            UOM: item.ORDER_QUANTITY_UOM || "",
            expired_date: null,
            classification: "",
            PO_LINE_QUANTITY: String(item.ORDERED_QUANTITY ?? "0"),
          }))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemField = (index: number, field: string, value: any) => {
    const newItems = [...editableItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setEditableItems(newItems);
  };

  const handleDeleteRow = (index: number) => {
    const newItems = [...editableItems];
    newItems.splice(index, 1);
    setEditableItems(newItems);
  };

  const handleManualSkuSubmit = (data: any) => {
    if (!data.sku || !data.qty_plan || !data.uom || !data.classification) {
      showErrorToast("Please select SKU, input Qty, UOM, and Classification.");
      return;
    }

    const selectedSKU = SKUList.find((s) => s.sku === data.sku);
    const selectedUom = uomData.find((uom: any) => uom.id === data.uom);
    const selectedClassification = clsData.find(
      (cls: any) => cls.id === data.classification
    );

    if (!selectedSKU || !selectedUom || !selectedClassification) {
      showErrorToast("Invalid SKU or UOM or Classification selected.");
      return;
    }
    const newItem = {
      SKU: selectedSKU.sku,
      KODE_ITEM: selectedSKU.item_number,
      UOM: selectedUom.name,
      expired_date: null,
      classification: selectedClassification.id,
      PO_LINE_QUANTITY: data.qty_plan,
    };
    setEditableItems((prev) => [...prev, newItem]);
    setShowManualModal(false);
  };

  const sourceOptions = sourceList.map((src: any) => ({
    label: src.name, // tampil di select
    value: src.id, // dikirim ke API
    type: src.type, // untuk manipulasi inputan (PO/SO)
    code: src.code, // jika butuh
  }));

  // HEADER FIELDS
  const headerFields: FieldConfig[] = [
    {
      name: "supplier_name",
      label: "Supplier Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "supplier_address",
      label: "Supplier Address",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "selected_source",
      label: "Inbound Type",
      type: "select",
      options: [{ label: "-- Source --", value: "" }, ...sourceOptions],
    },
    {
      name: "po_no",
      label: "PO No*",
      type: "custom",
      validation: { required: "Required" },
      element: (
        <>
          <input
            value={poNoInput}
            onChange={(e) => setPoNoInput(e.target.value)}
            className="w-full px-3 py-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
          <button
            type="button"
            onClick={() => {
              if (!poNoInput.trim()) {
                showErrorToast("PO No tidak boleh kosong.");
                return;
              }
              fetchPoDetail(poNoInput);
            }}
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
    {
      name: "so_no",
      label: "SO No*",
      type: "custom",
      validation: { required: "Required" },
      element: (
        <>
          <input
            value={soNoInput}
            onChange={(e) => setSoNoInput(e.target.value)}
            className="w-full px-3 py-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
          <button
            type="button"
            onClick={() => {
              if (!soNoInput.trim()) {
                showErrorToast("SO No tidak boleh kosong.");
                return;
              }
              fetchSoDetail(soNoInput);
            }}
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

    {
      name: "order_type",
      label: "Order Type*",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Order Type --", value: "" },
        { label: "Regular", value: "regular" },
        { label: "Transfer Warehouse", value: "transfer_warehouse" },
      ],
    },
    {
      name: "warehouse_id",
      label: "Inbound Location*",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Select --", value: "" },
        { label: "Gudang A", value: "gudang_a" },
        { label: "Gudang B", value: "gudang_b" },
        { label: "Gudang C", value: "gudang_c" },
      ],
    },
    {
      name: "receive_type",
      label: "Receive Type*",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Select Type --", value: "" },
        { value: "single_receive", label: "Single Receive" },
        { value: "partial_receive", label: "Partial Receive" },
      ],
    },
    {
      name: "plan_date",
      label: "Plan Delivery Date*",
      type: "date",
      validation: { required: "Required" },
    },
    {
      name: "so_type",
      label: "SO Type",
      type: "text",
      disabled: true,
    },
    {
      name: "prin_group",
      label: "GROUP",
      type: "text",
      disabled: true,
    },
  ];

  // DETAIL ITEM COLUMNS
  const itemColumns: ColumnDef<any>[] = useMemo(
    () => [
      { accessorKey: "SKU", header: "SKU" },
      { accessorKey: "KODE_ITEM", header: "KODE ITEM" },
      {
        accessorKey: "UOM",
        header: "UOM",
        cell: ({ row }) => (
          <select
            value={editableItems[row.index]?.UOM ?? ""}
            onChange={(e) => updateItemField(row.index, "UOM", e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Select UOM --</option>
            {uomData.map((uom: any) => (
              <option key={uom.name} value={uom.name}>
                {uom.name}
              </option>
            ))}
          </select>
        ),
      },
      {
        accessorKey: "PO_LINE_QUANTITY",
        header: "QTY Plan",
        cell: ({ row }) => {
          const defaultValue = editableItems[row.index]?.PO_LINE_QUANTITY ?? "";
          const [inputValue, setInputValue] = useState(defaultValue);

          useEffect(() => {
            setInputValue(editableItems[row.index]?.PO_LINE_QUANTITY ?? "");
          }, [row.index, editableItems]);

          const handleBlur = () => {
            updateItemField(row.index, "PO_LINE_QUANTITY", inputValue);
          };

          return (
            <input
              type="number"
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
        cell: ({ row }) => {
          // Default value logic
          const defaultClassificationId =
            "e2e00121-de2b-48f7-bf7d-72993fa5516f";
          const value =
            editableItems[row.index]?.classification ?? defaultClassificationId;

          useEffect(() => {
            // If not set, set default classification
            if (!editableItems[row.index]?.classification) {
              updateItemField(
                row.index,
                "classification",
                defaultClassificationId
              );
            }
            // eslint-disable-next-line
          }, []);

          return (
            <select
              value={value}
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
          );
        },
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
    [editableItems, uomData, clsData]
  );

  // Manual SKU Form Fields
  const manualFormFields = [
    {
      name: "sku",
      label: "SKU",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Select SKU --", value: "" },
        ...SKUList.map((sku) => ({
          label: `${sku.sku} - ${sku.item_number}`,
          value: sku.sku,
        })),
      ],
    },
    {
      name: "uom",
      label: "UOM",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Select UOM --", value: "" },
        ...uomData.map((uom: any) => ({
          label: uom.name,
          value: uom.id,
        })),
      ],
    },
    {
      name: "qty_plan",
      label: "Qty Plan",
      type: "number",
      validation: { required: "Required" },
    },
    {
      name: "classification",
      label: "Classification",
      type: "select",
      validation: { required: "Required" },
      options: [
        { label: "-- Select Classification --", value: "" },
        ...clsData.map((cls: any) => ({
          label: cls.classification_name,
          value: cls.id,
        })),
      ],
    },
  ];

  // Button Reset PO Detail
  const handleResetDetail = () => {
    setPoList([]);
    setEditableItems([]);
    setPoNoInput("");
    setSoNoInput("");
    setShowManualModal(false);
    methods.reset({
      supplier_name: "",
      supplier_address: "",
      selected_source: "",
      po_no: "",
      so_no: "",
      so_type: "",
      order_type: "",
      warehouse_id: "",
      receive_type: "",
      plan_date: "",
      notes: "",
      receipt_no: "",
    });
  };

  // SUMBIT INBOUND PLANNING
  const onSubmit = (formData: any) => {
    // Validate items
    // Validasi field kosong pada setiap item
    const requiredFields = [
      { key: "SKU", label: "SKU" },
      { key: "PO_LINE_QUANTITY", label: "Qty Plan" },
      { key: "UOM", label: "UOM" },
      { key: "classification", label: "Classification" },
    ];

    const emptyFields: string[] = editableItems
      .map((item, idx) => {
        const missing = requiredFields
          .filter((f) => !item[f.key])
          .map((f) => f.label);
        return missing.length > 0
          ? `Item ${idx + 1}: ${missing.join(", ")}`
          : null;
      })
      .filter(Boolean) as string[];

    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Item(s)",
        html: `Beberapa item memiliki field kosong:<br><ul style="text-align:left">${emptyFields
          .map((f) => `<li>${f}</li>`)
          .join("")}</ul>`,
      });
      return;
    }

    const payload: CreateInboundPlanning = {
      inbound_planning_no: "",
      organization_id: 1,
      source_id: formData.selected_source?.value || "",
      delivery_no: formData.receipt_no || "",
      po_no: poNoInput || soNoInput,
      client_name: formData.supplier_name,
      order_type: formData.order_type?.value || "",
      task_type: formData.receive_type?.value || "",
      notes: formData.notes || "",
      supplier_id: String(
        selectedPO.ID_VENDOR || selectedPO.ORGANIZATION_ID_TO || ""
      ),
      warehouse_id: formData.warehouse_id?.value || "",
      plan_delivery_date: toLocalISOString(formData.plan_date),
      plan_status: "DRAFT",
      plan_type: "single",
      items: editableItems.map((item) => ({
        inbound_plan_id: "",
        sku: item.SKU,
        qty_plan: Number(item.PO_LINE_QUANTITY),
        uom: item.UOM,
        classification_item_id: item.classification,
      })),
    };

    console.log("Payload to create Inbound Planning:", payload);

    createData(payload).then((result) => {
      if (result?.success) {
        navigate("/inbound_planning");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal membuat Inbound Planning",
          text: result?.message,
        });
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <ActIndicator />
      ) : (
        <div>
          <PageBreadcrumb
            breadcrumbs={[
              { title: "Inbound Planning", path: "/inbound_planning" },
              { title: "Create Inbound Planning" },
            ]}
          />

          <FormProvider {...methods}>
            <DynamicForm
              fields={headerFields}
              onSubmit={methods.handleSubmit(onSubmit)}
              defaultValues={{}}
              control={methods.control}
              register={methods.register}
              setValue={methods.setValue}
              handleSubmit={methods.handleSubmit}
              isEditMode={true}
              watch={methods.watch}
            />
          </FormProvider>

          <div className="flex justify-end mt-10 mb-2 gap-5">
            <Button
              variant="primary"
              type="button"
              onClick={() => setShowManualModal(true)}
            >
              + Add Item Manually
            </Button>

            <Button
              variant="danger"
              type="button"
              onClick={() => handleResetDetail()}
            >
              &#x21bb;
            </Button>
          </div>

          <div className="mt-4 mb-4">
            <TabsSection
              tabs={[
                {
                  label: "Item Details",
                  content: (
                    <ItemTable data={editableItems} columns={itemColumns} />
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

          <ModalForm
            isOpen={showManualModal}
            onClose={() => setShowManualModal(false)}
            onSubmit={handleManualSkuSubmit}
            formFields={manualFormFields}
            defaultValues={{
              sku: "",
              qty_plan: "",
              uom: "",
              classification: "",
            }}
            title="Add SKU Manually"
          />
        </div>
      )}
    </>
  );
};

export default InboundPlanningAdd;
