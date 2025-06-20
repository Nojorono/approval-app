import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import Label from "../../../../components/form/Label";
import { useDebounce } from "../../../../helper/useDebounce";
import ModalCreateForm from "../../MasterUOM/Table/CreateUOM";
import { useUomStore } from "../../../../API/store/MasterStore";
import Button from "../../../../components/ui/button/Button";

interface Option {
  value: string;
  label: string;
}

const DataTable = () => {
  const navigate = useNavigate();
  const { fetchUOM, uom, isLoading, error } = useUomStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedFilter = useDebounce(globalFilter, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUOM();
  }, []);

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
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Tambah UOM
              </Button>

              <ModalCreateForm
                onRefresh={fetchUOM}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>
        </div>

        <AdjustTable
          data={uom.map((item) => ({
            ...item,
            isActive: String(item.isActive),
          }))}
          globalFilter={debouncedFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </>
    </>
  );
};

export default DataTable;
