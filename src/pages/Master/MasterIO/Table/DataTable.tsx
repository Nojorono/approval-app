import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import Label from "../../../../components/form/Label";
import { useDebounce } from "../../../../helper/useDebounce";
import ModalCreateForm from "./CreateIO";
import { useUomStore, useIOStore } from "../../../../API/store/MasterStore";

interface Option {
  value: string;
  label: string;
}

const DataTable = () => {
  const navigate = useNavigate();

  const { isLoading, error, fetchIOData, ioList } = useIOStore();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedFilter = useDebounce(globalFilter, 500);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchIOData();
  }, []);

  const handleDetail = (id: number) => {
    console.log(`Navigating to detail page for UOM with ID: ${id}`);
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
              <ModalCreateForm onRefresh={fetchIOData} />
            </div>
          </div>
        </div>

        <AdjustTable
          data={ioList.map((item) => ({
            ...item,
            id: Number(item.id),
            organization_id: String(item.organization_id),
          }))}
          globalFilter={debouncedFilter}
          setGlobalFilter={setGlobalFilter}
          onDetail={handleDetail}
        />
      </>
    </>
  );
};

export default DataTable;
