import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import TabsSection from "../../../../../components/wms-components/inbound-component/tabs/TabsSection";
import { FaCheck, FaEdit, FaUserPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Button from "../../../../../components/ui/button/Button";
import { useStoreInboundPlanning } from "../../../../../DynamicAPI/stores/Store/MasterStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalAssign, ModalDialog } from "../../../../../components/modal/type";
import DetailInboundItem from "./DetailItem/DetailItem";
import ViewChecker from "./ViewChecker";
import TransporterDetail from "./TransportAndLoading/TransportAndLoading";
import DynamicForm, {
  FieldConfig,
} from "../../../../../components/wms-components/inbound-component/form/DynamicForm";
import ActIndicator from "../../../../../components/ui/activityIndicator";
import { toLocalISOString } from "../../../../../helper/FormatDate";
import Swal from "sweetalert2";
import DeliveryOrder from "./DeliveryOrder/DeliverOrder";
import Attachment from "./Attachment/Attachment";
import CheckerScan from "./ScanHistory/CheckerScan";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../../components/toast";

const orderTypeOptions = [
  { label: "-- Order Type --", value: "" },
  { label: "Regular", value: "regular" },
  { label: "Transfer Warehouse", value: "transfer_warehouse" },
];

const taskTypeOptions = [
  { label: "-- Select Type --", value: "" },
  { label: "Single Receive", value: "single_receive" },
  { label: "Partial Receive", value: "partial_receive" },
];

// Helper untuk mencari option yang cocok berdasarkan value string
const getOption = (
  options: { label: string; value: string }[],
  value: string
) => options.find((opt) => opt.value === value) || options[0];

const DetailInbound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const { fetchById, detail, isLoading, updateData } =
    useStoreInboundPlanning();

  const [openMdlTab, setOpenMdlTab] = useState(false);
  const [openMdlDialog, setOpnMdlDialog] = useState(false);

  const methods = useForm();
  const [activeTab, setActiveTab] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    if (data && data.id) {
      fetchById(data.id);
    }
  }, [data, fetchById]);

  const {
    id: inbound_planning_id,
    inbound_planning_no,
    delivery_no,
    po_no,
    client_name,
    order_type = "",
    task_type = "",
    plan_delivery_date,
    plan_status,
    plan_type,
    items = [],
  } = detail || {};

  console.log("Plan Status:", plan_status);

  const InboundFields: FieldConfig[] = [
    {
      name: "id",
      label: "ID",
      type: "text",
      disabled: true,
    },
    {
      name: "inbound_planning_no",
      label: "Inbound Planning No",
      type: "text",
      disabled: true,
    },
    { name: "client_name", label: "Supplier Name", type: "text" },
    { name: "po_no", label: "Reference No*", type: "text" },
    {
      name: "order_type",
      label: "Order Type*",
      type: "select",
      options: orderTypeOptions,
    },
    {
      name: "task_type",
      label: "Task Type*",
      type: "select",
      options: taskTypeOptions,
    },
    { name: "plan_delivery_date", label: "Plan Delivery Date*", type: "date" },
  ];

  const defaultValues = {
    id: inbound_planning_id,
    inbound_planning_no,
    delivery_no,
    po_no,
    client_name,
    order_type: getOption(orderTypeOptions, order_type),
    task_type: getOption(taskTypeOptions, task_type),
    plan_delivery_date: plan_delivery_date
      ? new Date(plan_delivery_date)
      : null,
    plan_status,
    plan_type,
    plan_date: plan_delivery_date ? new Date(plan_delivery_date) : null,
  };

  const simplifiedItems = items.map((itemWrapper) => {
    const { id, item, expired_date, qty_plan, uom, classification_item } =
      itemWrapper;
    return {
      id,
      sku: item?.sku ?? "",
      name: item?.name ?? "",
      description: item?.description ?? "",
      expired_date,
      qty_plan,
      uom,
      classification_name: classification_item?.classification_name ?? "",
      classification_code: classification_item?.classification_code ?? "",
    };
  });

  // Toggle edit mode
  const handleEditToggle = () => setIsEditMode((prev) => !prev);

  // Submit assign checker
  const handleSubmitAssignChecker = (assignData: any) => {
    // Submit ke API assign checker
    console.log("Assign Checker Payload:", assignData);
    setOpenMdlTab(false);
  };

  // Submit confirm inbound
  const handleSubmitConfirmInbound = () => {
    alert("Confirm Inbound Planning After Scan");
    setOpnMdlDialog(true);
  };

  const handleConfirm = () => {
    console.log("Confirmed!");
    setOpnMdlDialog(false);
  };

  // Submit update (form + detail items)
  const handleSubmitUpdate = () => {
    const formData = methods.getValues();
    const payload = {
      inbound_planning_no: formData.inbound_planning_no,
      organization_id: detail?.organization_id,
      delivery_no: formData.delivery_no,
      po_no: formData.po_no,
      client_name: formData.client_name,
      order_type: formData.order_type.value,
      task_type: formData.task_type.value,
      notes: formData.notes,
      supplier_id: detail?.supplier_id ?? "",
      warehouse_id: detail?.warehouse_id ?? "",
      plan_delivery_date: toLocalISOString(formData.plan_delivery_date),
      plan_status: detail?.plan_status ?? "",
      plan_type: detail?.plan_type ?? "",
      items: itemDetails.map((item: any) => ({
        inbound_plan_id: inbound_planning_id,
        sku: item.sku,
        item_id: item.id,
        qty_plan: item.qty_plan,
        uom: item.uom,
        classification_item_id: item.classification_item_id,
      })),
    };

    // Submit ke API update inbound planning
    console.log("Inb Plan ID:", inbound_planning_id);
    console.log("Update Payload:", payload);

    // updateData(id, payload).then((res: any) => {
    //   if (res?.success) {
    //     setIsEditMode(false);
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Error",
    //       text: res?.message || "Failed to update Inbound Planning.",
    //     });
    //   }
    // });
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
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      fetchById(id); // Refresh data after update
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
    <div>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Inbound Planning", path: "/inbound_planning" },
          { title: `Detail Inbound Planning` },
        ]}
      />

      <DynamicForm
        fields={InboundFields}
        onSubmit={() => {}}
        defaultValues={defaultValues}
        control={methods.control}
        register={methods.register}
        setValue={methods.setValue}
        handleSubmit={methods.handleSubmit}
        isEditMode={isEditMode}
        onEditToggle={handleEditToggle}
        watch={methods.watch}
      />

      {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-3">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            {plan_status === "IN_PROGRESS" && (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleEditToggle}
                startIcon={<FaEdit size={18} />}
                disabled={isEditMode}
              >
                Update Inbound
              </Button>
            )}
            {isEditMode && (
              <>
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleSubmitUpdate}
                >
                  Save Changes
                </Button>
              </>
            )}
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setOpenMdlTab(true)}
                startIcon={<FaUserPlus size={18} />}
              >
                Assign Checker
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <ModalAssign
        isOpen={openMdlTab}
        onClose={() => setOpenMdlTab(false)}
        onSubmit={handleSubmitAssignChecker}
        formFields={[
          {
            name: "checker_leader_id",
            label: "Checker Leader ID",
            type: "select",
            validation: { required: "Required" },
          },
          {
            name: "checkers",
            label: "Checkers",
            type: "multiselect",
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
        ]}
        title="Assign Checker"
        parmeters={{ inbound_planning_id }}
      />

      {/* TAB CONTENT */}
      <div className="mt-8 mb-4">
        {isLoading || !detail ? (
          <>
            <ActIndicator />
          </>
        ) : (
          <TabsSection
            tabs={[
              {
                label: "Item Details",
                content: (
                  <>
                    <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-center mb-4">
                      {plan_status === "DRAFT" && (
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          startIcon={<FaCheck size={18} />}
                          onClick={() => {
                            handleConfirmInbound(inbound_planning_id);
                          }}
                        >
                          Confirm Inbound
                        </Button>
                      )}
                      {plan_status === "IN_PROGRESS" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={handleEditToggle}
                          startIcon={<FaEdit size={18} />}
                          disabled={isEditMode}
                        >
                          Update Inbound
                        </Button>
                      )}
                      {isEditMode && (
                        <>
                          <Button
                            type="button"
                            variant="danger"
                            size="md"
                            onClick={handleEditToggle}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={handleSubmitUpdate}
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </div>

                    <DetailInboundItem
                      data={simplifiedItems}
                      isEditMode={isEditMode}
                      onItemsChange={setItemDetails}
                    />
                  </>
                ),
              },
              ...(plan_status !== "DRAFT"
                ? [
                    {
                      label: "Transport & Loading",
                      content: <TransporterDetail data={data} />,
                    },
                    {
                      label: "Surat Jalan",
                      content: <DeliveryOrder data={data} />,
                    },
                    {
                      label: "Scan History",
                      content: <CheckerScan data={data} />,
                    },
                    {
                      label: "Attachments",
                      content: <Attachment data={data} />,
                    },
                    {
                      label: "View Checker",
                      content: (
                        <>
                          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-center mb-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="md"
                              onClick={() => setOpenMdlTab(true)}
                              startIcon={<FaUserPlus size={18} />}
                            >
                              Assign Checker
                            </Button>
                          </div>
                          <ViewChecker data={data} />{" "}
                        </>
                      ),
                    },
                  ]
                : []),
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>

      <div className="flex justify-start mt-6">
        <div className="flex gap-3">
          {/* <Button
            type="submit"
            variant="secondary"
            size="md"
            onClick={() => handleSubmitConfirmInbound()}
            startIcon={<FaCheck size={18} />}
          >
            Confirm Inbound
          </Button> */}
        </div>

        <ModalDialog
          isOpen={openMdlDialog}
          onClose={() => setOpnMdlDialog(false)}
          onConfirm={handleConfirm}
          title="Terjadi ketidaksesuaian data antara Qty Plan dan Qty Scan, apakah Anda ingin memproses data ini?"
          size="xl"
          confirmText="Proses"
          cancelText="Tutup"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Qty Plan</th>
                  <th className="px-4 py-2">Qty Scan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">SKU-123</td>
                  <td className="px-4 py-2">4000</td>
                  <td className="px-4 py-2">2000</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">SKU-456</td>
                  <td className="px-4 py-2">7000</td>
                  <td className="px-4 py-2">5000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ModalDialog>
      </div>
    </div>
  );
};

export default DetailInbound;
