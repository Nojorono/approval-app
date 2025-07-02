import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import TabsSection from "../../../../components/wms-components/inbound-component/tabs/TabsSection";
import { FaCheck, FaCubes, FaUserPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Button from "../../../../components/ui/button/Button";
import { useStoreInboundPlanning } from "../../../../DynamicAPI/stores/Store/MasterStore";
import { useLocation } from "react-router-dom";
import { ModalAssign, ModalDialog } from "../../../../components/modal/type";

import DetailInboundItem from "./DetailItem";
import ViewChecker from "./ViewChecker";
import TransporterDetail from "./TransportAndLoading";

const DetailInbound = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const { fetchById, detail } = useStoreInboundPlanning();

  useEffect(() => {
    if (data && data.id) {
      const fetchData = async () => {
        await fetchById(data.id);
      };
      fetchData();
    } else {
      console.log("DetailInbound: No data or ID provided in location state.");
    }
  }, []);

  const [openMdlTab, setOpenMdlTab] = useState(false);
  const [openMdlDialog, setOpnMdlDialog] = useState(false);

  const methods = useForm();
  const [activeTab, setActiveTab] = useState(0);
  const { id, inbound_planning_no } = detail || {};

  const onSubmit = (formData: any) => {
    setOpnMdlDialog(true);
    // console.log("Form Assign Checker and Detail Data Submitted:", formData);
  };

  const onClose = () => {
    setOpenMdlTab(false);
  };

  const handleSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  const formFields = [
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
  ];

  const handleConfirm = () => {
    console.log("Confirmed!");
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
            <div className="w-20 h-20 overflow-hidden">
              <FaCubes className="absolute w-20 h-20 text-orange-400 dark:text-orange-600" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                Inbound Planning :
              </h4>
              <h5 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {inbound_planning_no || "N/A"}
              </h5>
            </div>
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
        onClose={onClose}
        onSubmit={(data) => handleSubmit(data)}
        formFields={formFields}
        title={"Assign Checker"}
        parmeters={{ id }}
      />

      <div className="mt-6 mb-4">
        <TabsSection
          tabs={[
            {
              label: "Item Details",
              content: <DetailInboundItem data={data} />,
            },
            {
              label: "Transport & Loading",
              content: <TransporterDetail data={data} />,
            },
            {
              label: "Scan History",
              content: <>Transport & Loading</>,
            },
            {
              label: "Attachments",
              content: <>Transport & Loading</>,
            },
            {
              label: "View Checker",
              content: <ViewChecker data={data} />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="flex justify-start mt-6">
        <Button
          type="submit"
          variant="secondary"
          size="md"
          onClick={methods.handleSubmit(onSubmit)}
          startIcon={<FaCheck size={18} />}
        >
          Confirm Inbound
        </Button>

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
