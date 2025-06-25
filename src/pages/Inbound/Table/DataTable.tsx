import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import DatePicker from "../../../components/form/date-picker";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import Spinner from "../../../components/ui/spinner";
import { usePagePermissions } from "../../../utils/UserPermission/UserPagePermissions";
import { showErrorToast } from "../../../components/toast";
import { useDebounce } from "../../../helper/useDebounce";
import { useStoreInboundPlanning } from "../../../DynamicAPI/stores/Store/MasterStore";

const TableMasterMenu = () => {
  const navigate = useNavigate();

  const { list: inboundPlanningData, fetchAll } = useStoreInboundPlanning();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedFilter = useDebounce(globalFilter, 500);

  const [startDate, setStartDate] = useState<Date | null>(null);

  const options = [
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const handleResetFilters = () => {
    console.log("Resetting filters");
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDetail = (id: any) => {
    console.log(`Navigating to detail page for ID: ${id}`);
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="search">Search</Label>
            <Input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Masukan data.."
            />
          </div>

          <div className="space-x-4">
            {/* <Button variant="outline" size="sm">
                <FaFileDownload className="mr-2" /> Unduh Data
              </Button>

              <Button variant="outline" size="sm">
                <FaFileImport className="mr-2" /> Unggah Data
              </Button> */}

            <Button
              size="sm"
              variant="primary"
              startIcon={<FaPlus className="size-5" />}
              onClick={() => navigate("/inbound_planning/create")}
            >
              Add Inbound Planning
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="space-x-4">
            <Label htmlFor="search">Inbound Planning No</Label>
            <Input type="text" id="search" placeholder="Inbound plan no.." />
          </div>

          <div className="space-x-4">
            <Label htmlFor="date-picker">Plan Delivery Date</Label>
            <DatePicker
              id="start-date-salesman"
              placeholder="Select a date"
              defaultDate={startDate || undefined}
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Order Type</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={(value) => console.log("Selected value:", value)}
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Status</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={(value) => console.log("Selected value:", value)}
            />
          </div>

          <div className="flex justify-center items-center mt-5">
            <Button variant="rounded" size="sm" onClick={handleResetFilters}>
              <FaUndo />
            </Button>
          </div>
        </div>
      </div>

      <AdjustTable
        data={inboundPlanningData}
        globalFilter={debouncedFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onRefresh={fetchAll}
      />
    </>
  );
};

export default TableMasterMenu;
