import { useMemo } from "react";

export type GroupedPermission = {
  menu_id: number;
  permissions: string[];
};

export const usePermission = () => {
  const groupedPermissions: GroupedPermission[] = useMemo(() => {
    const storedUserLogin = localStorage.getItem("user_login_data");

    if (!storedUserLogin || storedUserLogin === "undefined") {
      console.warn("No user_login_data found in localStorage.");
      return [];
    }

    try {
      const dataUserLogin = JSON.parse(storedUserLogin);

      const menus: {
        id: number;
        actions: string[];
      }[] = dataUserLogin?.menus || [];

      return menus.reduce((acc: GroupedPermission[], menu) => {
        const existing = acc.find((item) => item.menu_id === menu.id);
        if (existing) {
          existing.permissions = Array.from(
            new Set([...existing.permissions, ...menu.actions])
          );
        } else {
          acc.push({
            menu_id: menu.id,
            permissions: menu.actions || [],
          });
        }
        return acc;
      }, []);
    } catch (err) {
      console.warn("Failed to parse user_login_data in usePermission", err);
      return [];
    }
  }, []);

  const hasPermission = useMemo(() => {
    return (menuId: number, permissionType: string): boolean => {
      if (
        groupedPermissions.some(
          (perm) => perm.menu_id === -1 && perm.permissions.includes("Manage")
        )
      ) {
        return true;
      }

      const found = groupedPermissions.find((perm) => perm.menu_id === menuId);

      return (
        !!found &&
        (found.permissions.includes("Manage") ||
          found.permissions.includes(permissionType))
      );
    };
  }, [groupedPermissions]);

  return { hasPermission, permissions: groupedPermissions };
};
