import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import Label from "../../../../components/form/Label";
import { useDebounce } from "../../../../helper/useDebounce";
import ModalCreateForm from "./CreatePallet.tsx";
import {useRoleStore} from "../../../../API/store/MasterStore";
import {usePalletStore} from "../../../../API/store/MasterStore/masterPalletStore.ts";

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


const DataTable = () => {
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedFilter = useDebounce(globalFilter, 500);

  const [startDate, setStartDate] = useState<Date | null>(null);


  const { fetchPallet, dataPallet, deletePallet,fetchPalletById } = usePalletStore();

  useEffect(() => {
    fetchPallet()
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePallet(id);
      fetchPallet();
    } catch (error) {
      console.error(`Failed to delete role with ID: ${id}`, error);
    }
  };

  const handleDetail = async (id: number) => {
    try {
      await fetchPalletById(id);
    } catch (error) {
      console.error(`Failed to delete role with ID: ${id}`, error);
    }
  }



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
              <ModalCreateForm onRefresh={fetchPallet} />
            </div>
          </div>
        </div>

        <AdjustTable
          data={dataPallet}
          globalFilter={debouncedFilter}
          setGlobalFilter={setGlobalFilter}
          onDelete={handleDelete}
          onDetail={handleDetail}
        />
      </>
    </>
  );
};

export default DataTable;
