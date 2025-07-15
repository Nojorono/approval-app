// import { useState, useEffect } from "react";
// import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
// import TabsSection from "../../../../../components/wms-components/inbound-component/tabs/TabsSection";
// import { FaCheck, FaEdit, FaUserPlus } from "react-icons/fa";
// import { useForm } from "react-hook-form";
// import Button from "../../../../../components/ui/button/Button";
// import { useStoreInboundPlanning } from "../../../../../DynamicAPI/stores/Store/MasterStore";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ModalAssign, ModalDialog } from "../../../../../components/modal/type";
// import DetailInboundItem from "./DetailItem";
// import ViewChecker from "./ViewChecker";
// import TransporterDetail from "./TransportAndLoading";
// import DynamicForm, {
//   FieldConfig,
// } from "../../../../../components/wms-components/inbound-component/form/DynamicForm";

// const DetailInbound = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { data } = location.state || {};
//   const { fetchById, detail } = useStoreInboundPlanning();

//   const [openMdlTab, setOpenMdlTab] = useState(false);
//   const [openMdlDialog, setOpnMdlDialog] = useState(false);

//   const methods = useForm();
//   const [activeTab, setActiveTab] = useState(0);

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [itemDetails, setItemDetails] = useState([]);

//   useEffect(() => {
//     if (data && data.id) {
//       const fetchData = async () => {
//         await fetchById(data.id);
//       };
//       fetchData();
//     } else {
//       console.log("DetailInbound: No data or ID provided in location state.");
//     }
//   }, []);

//   console.log("DetailInbound data detail:", detail);

//   const {
//     id,
//     inbound_planning_no,
//     delivery_no,
//     po_no,
//     client_name,
//     order_type,
//     task_type,
//     notes,
//     plan_delivery_date,
//     plan_status,
//     plan_type,
//     items = [],
//   } = detail || {};

//   console.log("DetailInbound items:", items);

//   const onClose = () => {
//     setOpenMdlTab(false);
//   };

//   const handleSubmit = (param: any) => {
//     console.log("Submitted Data:", param);
//   };

//   const formFields = [
//     {
//       name: "checker_leader_id",
//       label: "Checker Leader ID",
//       type: "select",
//       validation: { required: "Required" },
//     },
//     {
//       name: "checkers",
//       label: "Checkers",
//       type: "multiselect",
//       fields: [
//         {
//           name: "id",
//           label: "Checker ID",
//           type: "text",
//           validation: { required: "Required" },
//         },
//         {
//           name: "name",
//           label: "Checker Name",
//           type: "text",
//           validation: { required: "Required" },
//         },
//       ],
//       validation: { required: "At least one checker is required" },
//     },
//     {
//       name: "assign_date_start",
//       label: "Assign Date Start",
//       type: "datetime-local",
//       validation: { required: "Required" },
//     },
//     {
//       name: "assign_date_finish",
//       label: "Assign Date Finish",
//       type: "datetime-local",
//       validation: { required: "Required" },
//     },
//   ];

//   const handleConfirm = () => {
//     console.log("Confirmed!");
//   };

//   const InboundFields: FieldConfig[] = [
//     {
//       name: "inbound_planning_no",
//       label: "Inbound Planning No",
//       type: "text",
//       disabled: true,
//     },
//     {
//       name: "client_name",
//       label: "Supplier Name",
//       type: "text",
//     },
//     {
//       name: "po_no",
//       label: "Reference No*",
//       type: "text",
//     },
//     {
//       name: "order_type",
//       label: "Order Type*",
//       type: "select",
//       options: [
//         { label: "-- Order Type --", value: "" },
//         { label: "Regular", value: "regular" },
//         { label: "Transfer Warehouse", value: "transfer_warehouse" },
//       ],
//     },
//     {
//       name: "task_type",
//       label: "Task Type*",
//       type: "select",
//       options: [
//         { label: "-- Select Type --", value: "" },
//         { value: "single_receive", label: "Single Receive" },
//         { value: "partial_receive", label: "Partial Receive" },
//       ],
//     },
//     {
//       name: "plan_date",
//       label: "Plan Delivery Date*",
//       type: "date",
//     },
//   ];

//   const defaultValues = {
//     id,
//     inbound_planning_no,
//     delivery_no,
//     po_no,
//     client_name,
//     order_type,
//     task_type,
//     notes,
//     plan_delivery_date,
//     plan_status,
//     plan_type,
//     plan_date: plan_delivery_date ? new Date(plan_delivery_date) : null,
//   };

//   const simplifiedItems = items.map((itemWrapper) => {
//     const { id, item, expired_date, qty_plan, uom, classification_item } =
//       itemWrapper;

//     const sku = item?.sku ?? "";
//     const name = item?.name ?? "";
//     const description = item?.description ?? "";
//     const classification_name = classification_item?.classification_name ?? "";
//     const classification_code = classification_item?.classification_code ?? "";

//     return {
//       id,
//       sku,
//       name,
//       description,
//       expired_date,
//       qty_plan,
//       uom,
//       classification_name,
//       classification_code,
//     };
//   });

//   const handleUpdate = () => {
//     console.log(
//       "Update Inbound Planning with ID:",
//       id,
//       "and Inbound Planning No:",
//       inbound_planning_no
//     );
//   };

//   // Handler untuk toggle edit mode
//   const handleEditToggle = () => setIsEditMode((prev) => !prev);

//   // Handler submit update
//   const onSubmit = (formData: any) => {
//     setOpnMdlDialog(true);
//     setIsEditMode(false); // Kembali ke view mode setelah submit
//     // Lakukan proses update data di sini
//     console.log("Form Data Updated:", formData);
//   };

//   const handleSubmitEdit = () => {
//     onSubmit(methods.getValues());
//     const formData = methods.getValues(); // data dari DynamicForm
//     const itemsData = itemDetails; // data dari DetailItem

//     console.log("Submitting Edit with formData:", formData);

//     const payload = {
//       ...formData,
//       items: itemsData,
//     };

//     // Submit ke API atau proses selanjutnya
//     console.log("Payload:", payload);
//   };

//   return (
//     <div>
//       <PageBreadcrumb
//         breadcrumbs={[
//           { title: "Inbound Planning", path: "/inbound_planning" },
//           { title: `Detail Inbound Planning` },
//         ]}
//       />

//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//         <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//             <DynamicForm
//               fields={InboundFields}
//               onSubmit={methods.handleSubmit(onSubmit)}
//               defaultValues={defaultValues}
//               control={methods.control}
//               register={methods.register}
//               setValue={methods.setValue}
//               handleSubmit={methods.handleSubmit}
//               isEditMode={isEditMode}
//               onEditToggle={handleEditToggle}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-3">
//         <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//           <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
//             <Button
//               type="button"
//               variant="primary"
//               size="md"
//               onClick={handleEditToggle}
//               startIcon={<FaEdit size={18} />}
//               disabled={isEditMode}
//             >
//               Update Inbound
//             </Button>
//             {isEditMode && (
//               <>
//                 <Button
//                   type="button"
//                   variant="danger"
//                   size="md"
//                   onClick={handleEditToggle}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="secondary"
//                   size="md"
//                   onClick={handleSubmitEdit}
//                 >
//                   Save Changes
//                 </Button>
//               </>
//             )}

//             <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
//               <Button
//                 type="button"
//                 variant="primary"
//                 size="md"
//                 onClick={() => setOpenMdlTab(true)}
//                 startIcon={<FaUserPlus size={18} />}
//               >
//                 Assign Checker
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ModalAssign
//         isOpen={openMdlTab}
//         onClose={onClose}
//         onSubmit={(data) => handleSubmit(data)}
//         formFields={formFields}
//         title={"Assign Checker"}
//         parmeters={{ id }}
//       />

//       <div className="mt-6 mb-4">
//         <TabsSection
//           tabs={[
//             {
//               label: "Item Details",
//               content: (
//                 <DetailInboundItem
//                   data={simplifiedItems}
//                   isEditMode={isEditMode}
//                   onItemsChange={setItemDetails}
//                 />
//               ),
//             },
//             {
//               label: "Transport & Loading",
//               content: <TransporterDetail data={data} />,
//             },
//             {
//               label: "Scan History",
//               content: <>Transport & Loading</>,
//             },
//             {
//               label: "Attachments",
//               content: <>Transport & Loading</>,
//             },
//             {
//               label: "View Checker",
//               content: <ViewChecker data={data} />,
//             },
//           ]}
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//         />
//       </div>

//       <div className="flex justify-start mt-6">
//         <div className="flex gap-3">
//           <Button
//             type="submit"
//             variant="secondary"
//             size="md"
//             onClick={methods.handleSubmit(onSubmit)}
//             startIcon={<FaCheck size={18} />}
//           >
//             Confirm Inbound
//           </Button>
//         </div>

//         <ModalDialog
//           isOpen={openMdlDialog}
//           onClose={() => setOpnMdlDialog(false)}
//           onConfirm={handleConfirm}
//           title="Terjadi ketidaksesuaian data antara Qty Plan dan Qty Scan, apakah Anda ingin memproses data ini?"
//           size="xl"
//           confirmText="Proses"
//           cancelText="Tutup"
//         >
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">Nama</th>
//                   <th className="px-4 py-2">Qty Plan</th>
//                   <th className="px-4 py-2">Qty Scan</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2">1</td>
//                   <td className="px-4 py-2">SKU-123</td>
//                   <td className="px-4 py-2">4000</td>
//                   <td className="px-4 py-2">2000</td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2">2</td>
//                   <td className="px-4 py-2">SKU-456</td>
//                   <td className="px-4 py-2">7000</td>
//                   <td className="px-4 py-2">5000</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </ModalDialog>
//       </div>
//     </div>
//   );
// };

// export default DetailInbound;

import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import TabsSection from "../../../../../components/wms-components/inbound-component/tabs/TabsSection";
import { FaCheck, FaEdit, FaUserPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Button from "../../../../../components/ui/button/Button";
import { useStoreInboundPlanning } from "../../../../../DynamicAPI/stores/Store/MasterStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalAssign, ModalDialog } from "../../../../../components/modal/type";
import DetailInboundItem from "./DetailItem";
import ViewChecker from "./ViewChecker";
import TransporterDetail from "./TransportAndLoading";
import DynamicForm, {
  FieldConfig,
} from "../../../../../components/wms-components/inbound-component/form/DynamicForm";

const DetailInbound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const { fetchById, detail } = useStoreInboundPlanning();

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
    id,
    inbound_planning_no,
    delivery_no,
    po_no,
    client_name,
    order_type,
    task_type,
    notes,
    plan_delivery_date,
    plan_status,
    plan_type,
    items = [],
  } = detail || {};

  const InboundFields: FieldConfig[] = [
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
      options: [
        { label: "-- Order Type --", value: "" },
        { label: "Regular", value: "regular" },
        { label: "Transfer Warehouse", value: "transfer_warehouse" },
      ],
    },
    {
      name: "task_type",
      label: "Task Type*",
      type: "select",
      options: [
        { label: "-- Select Type --", value: "" },
        { value: "single_receive", label: "Single Receive" },
        { value: "partial_receive", label: "Partial Receive" },
      ],
    },
    { name: "plan_delivery_date", label: "Plan Delivery Date*", type: "date" },
  ];

  const defaultValues = {
    id,
    inbound_planning_no,
    delivery_no,
    po_no,
    client_name,
    order_type,
    task_type,
    notes,
    plan_delivery_date,
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

  // Submit update (form + detail items)
  const handleSubmitUpdate = () => {
    const formData = methods.getValues();

    console.log("Submitting Update with formData:", formData);

    const payload = {
      ...formData,
      items: itemDetails,
    };
    // Submit ke API update inbound planning
    console.log("Update Payload:", payload);
    setIsEditMode(false);
  };

  // Submit assign checker
  const handleSubmitAssignChecker = (assignData: any) => {
    // Submit ke API assign checker
    console.log("Assign Checker Payload:", assignData);
    setOpenMdlTab(false);
  };

  // Submit confirm inbound
  const handleSubmitConfirmInbound = (formData: any) => {
    // Submit ke API confirm inbound
    console.log("Confirm Inbound Payload:", formData);
    // setOpnMdlDialog(true);
  };

  const handleConfirm = () => {
    console.log("Confirmed!");
    setOpnMdlDialog(false);
  };

  return (
    <div>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Inbound Planning", path: "/inbound_planning" },
          { title: `Detail Inbound Planning` },
        ]}
      />

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
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
            />
          </div>
        </div>
      </div>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-3">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
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
      </div>

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
        parmeters={{ id }}
      />

      <div className="mt-6 mb-4">
        <TabsSection
          tabs={[
            {
              label: "Item Details",
              content: (
                <DetailInboundItem
                  data={simplifiedItems}
                  isEditMode={isEditMode}
                  onItemsChange={setItemDetails}
                />
              ),
            },
            {
              label: "Transport & Loading",
              content: <TransporterDetail data={data} />,
            },
            { label: "Scan History", content: <>Transport & Loading</> },
            { label: "Attachments", content: <>Transport & Loading</> },
            { label: "View Checker", content: <ViewChecker data={data} /> },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="flex justify-start mt-6">
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            onClick={methods.handleSubmit(handleSubmitConfirmInbound)}
            startIcon={<FaCheck size={18} />}
          >
            Confirm Inbound
          </Button>
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
