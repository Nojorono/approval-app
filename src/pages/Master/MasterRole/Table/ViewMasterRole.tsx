import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

// import { useRoleStore } from "../../../../API/store/MasterStore";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import AdjustTableRole from "./AdjustTableRole";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";

import { useStoreRole } from "../../../../DynamicAPI/stores/Store/MasterStore";

const TableMasterRole = () => {
  const navigate = useNavigate();
  const { canCreate, canManage } = usePagePermissions();

  const {
    fetchAll: fetchRoles,
    list: roles,
    deleteData: deleteRole,
  } = useStoreRole();

  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDetail = (id: string) => {
    console.log(`Detail role with ID: ${id}`);
  };

  const handleDelete = async (id?: string) => {
    if (id !== undefined) {
      deleteRole(String(id));
    }
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <Input
            onChange={(e) => setGlobalFilter(e.target.value)}
            type="text"
            id="search"
            placeholder="🔍 Search..."
          />

          {canCreate && canManage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/role/create")}
            >
              <FaPlus className="mr-2" /> Tambah Role
            </Button>
          )}
        </div>
      </div>

      <AdjustTableRole
        data={roles}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TableMasterRole;
