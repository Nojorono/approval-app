import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import DatePicker from "../../../components/form/date-picker";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import Spinner from "../../../components/ui/spinner";
import axios from "axios";

import { usePagePermissions } from "../../../utils/UserPermission/UserPagePermissions";
import { useEmployeeStore } from "../../../API/store/MasterStore/masterEmployeeStore";
import { showErrorToast } from "../../../components/toast";
import { useDebounce } from "../../../helper/useDebounce";

interface Option {
  value: string;
  label: string;
}

// Dummy Data Type
type Inbound = {
  id: number;
  inboundNo: string;
  clientName: string;
  warehouseName: string;
  poNo: string;
  planDate: string;
  orderType: string;
  status: string;
  taskType: string;
};

// Dummy Data
const dummyData: Inbound[] = [
  {
    id: 1,
    inboundNo: "PL-WH-IN-0425-0001",
    clientName: "Niaga Nusa Abadi",
    warehouseName: "Pre-Loading Warehouse",
    poNo: "25210100011",
    planDate: "2025-04-07 00:00:00",
    orderType: "Regular",
    status: "Fully Received",
    taskType: "Single Receive",
  },
  {
    id: 2,
    inboundNo: "CWH03-IN-0325-0005",
    clientName: "Niaga Nusa Abadi",
    warehouseName: "Central WH 3",
    poNo: "25210100002",
    planDate: "2025-03-12 00:00:00",
    orderType: "Regular",
    status: "Fully Received",
    taskType: "Partial Receive",
  },
  {
    id: 3,
    inboundNo: "CWH04-IN-0325-0004",
    clientName: "Niaga Nusa Abadi",
    warehouseName: "Central WH 4",
    poNo: "25210100002",
    planDate: "2025-03-13 00:00:00",
    orderType: "Regular",
    status: "Open",
    taskType: "Single Receive",
  },
];

const TableMasterMenu = () => {
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedFilter = useDebounce(globalFilter, 500);

  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleDetail = (id: number) => {
    navigate("/detail_user", { state: { userId: id } });
  };

  const options = [
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const handleResetFilters = () => {
    console.log("Resetting filters");
  };

  return (
    <>
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
                variant="primary"
                size="sm"
                onClick={() => navigate("/inbound_planning/create")}
              >
                <FaPlus className="mr-2" /> Add Inbound Planning
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
          data={dummyData}
          globalFilter={debouncedFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </>
    </>
  );
};

export default TableMasterMenu;
