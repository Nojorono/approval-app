import React, { useState, forwardRef, useImperativeHandle } from "react";
import Checkbox from "../../../../components/form/input/Checkbox";

type PermissionType = "Create" | "View" | "Update" | "Delete" | "Manage";

type MenuItem = {
  id: any;
  name: string;
};

type Props = {
  menus: MenuItem[];
  permissionsList?: PermissionType[];
};

// ForwardRef untuk expose fungsi getSelectedPermissions
const TableMenuPermission = forwardRef(
  (
    {
      menus,
      permissionsList = ["Create", "View", "Update", "Delete", "Manage"],
    }: Props,
    ref
  ) => {
    const [checkedItems, setCheckedItems] = useState<
      Record<any, Record<PermissionType, boolean>>
    >({});

    const handleCheckboxChange = (
      menuId: any,
      permission: PermissionType
    ) => {
      setCheckedItems((prev) => ({
        ...prev,
        [menuId]: {
          ...prev[menuId],
          [permission]: !prev[menuId]?.[permission],
        },
      }));
    };

    useImperativeHandle(ref, () => ({
      getSelectedPermissions: () => {
        const result: { menu_id: any; action: PermissionType }[] = [];

        Object.entries(checkedItems).forEach(([menuId, perms]) => {
          Object.entries(perms).forEach(([permType, isChecked]) => {
            if (isChecked) {
              result.push({
                menu_id: menuId,
                action: permType as PermissionType,
              });
            }
          });
        });

        return result;
      },
    }));

    return (
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Menu</th>
            {permissionsList.map((perm) => (
              <th key={perm} className="border border-gray-300 p-2 text-center">
                {perm}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td className="border border-gray-300 p-2">{menu.name}</td>
              {permissionsList.map((perm) => (
                <td
                  key={perm}
                  className="border border-gray-300 p-2 text-center"
                >
                  <Checkbox
                    checked={!!checkedItems[menu.id]?.[perm]}
                    onChange={() => handleCheckboxChange(menu.id, perm)}
                    label=""
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

export default TableMenuPermission;
