import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useDebounce } from "../../../../helper/useDebounce";
import DynamicTable from "../../../../components/wms-components/DynamicTable";
import { useStoreUser } from "../../../../DynamicAPI/stores/Store/MasterStore";
import { useRoleStore } from "../../../../API/store/MasterStore";

const DataTable = () => {
  const {
    list: userData,
    createData,
    updateData,
    deleteData,
    fetchAll,
  } = useStoreUser();

  const { fetchRoles, roles } = useRoleStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchAll();
  }, []);

  // Fungsi untuk format payload create
  const handleCreate = (data: any) => {
    const formattedData = {
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
      pin: data.pin,
      isActive: data.isActive,
      roleId: data.roleId,
    };
    return createData(formattedData);
  };

  // Fungsi untuk format payload update
  const handleUpdate = (data: any) => {
    const { id, ...rest } = data;

    console.log("data", data);
    
    return updateData(id, {
      username: rest.username,
      email: rest.email,
      password: rest.password,
      phone: rest.phone,
      isActive: rest.isActive,
      roleId: rest.roleId,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "pin",
        header: "PIN",
      },
      {
        accessorKey: "roleId",
        header: "Role",
        cell: (info: any) => {
          const role = roles?.find((role: any) => role.id === info.getValue());
          return role ? role.name : "-";
        },
      },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: (info: any) => (info.getValue() ? "Active" : "Inactive"),
      },
    ],
    [roles]
  );

  const formFields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validation: { required: "Required" },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      validation: { required: "Required" },
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "pin",
      label: "PIN",
      type: "text",
      validation: {
        required: "Required",
        minLength: { value: 6, message: "PIN must be 6 digits" },
        maxLength: { value: 6, message: "PIN must be 6 digits" },
        pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" },
      },
      noNeedEdit: true,
    },
    {
      name: "roleId",
      label: "Role",
      type: "select",
      options:
        roles?.map((role: any) => ({
          label: role.name,
          value: role.id,
        })) || [],
      validation: { required: "Required" },
    },
    {
      name: "isActive",
      label: "",
      type: "checkbox",
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  ];

  // Helper to ellipsis text if longer than 10 chars
  const ellipsis = (text: string) =>
    typeof text === "string" && text.length > 10
      ? text.slice(0, 10) + "..."
      : text;

  // Update columns to use ellipsis for long values
  columns.forEach((col: any) => {
    if (["username", "email", "phone", "pin"].includes(col.accessorKey)) {
      const prevCell = col.cell;
      col.cell = (info: any) => {
        const value = info.getValue();
        const display = ellipsis(value);
        // If there was a custom cell before, use it
        return prevCell
          ? prevCell({ ...info, getValue: () => display })
          : display;
      };
    }
  });


  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Masukan data.."
            />
          </div>
          <div className="space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Tambah Data
            </Button>
          </div>
        </div>
      </div>

      <DynamicTable
        data={userData}
        globalFilter={debouncedSearch}
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setCreateModalOpen(false)}
        columns={columns}
        formFields={formFields}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        onDelete={async (id) => {
          await deleteData(id);
        }}
        onRefresh={fetchAll}
        getRowId={(row) => row.id}
        title="Form Data"
      />
    </>
  );
};

export default DataTable;
