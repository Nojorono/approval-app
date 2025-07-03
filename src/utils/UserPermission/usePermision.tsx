// import { useMemo } from "react";

// export type GroupedPermission = {
//   menu_id: number;
//   permissions: string[];
// };

// export const usePermission = () => {
//   const groupedPermissions: GroupedPermission[] = useMemo(() => {
//     const storedUserLogin = localStorage.getItem("user_login_data");

//     if (!storedUserLogin || storedUserLogin === "undefined") {
//       console.warn("No user_login_data found in localStorage.");
//       return [];
//     }

//     try {
//       const dataUserLogin = JSON.parse(storedUserLogin);

//       console.log("Parsed user_login_data in usePermission:", dataUserLogin);

//       const rawPermissions: {
//         menu_id: number;
//         permission_type: string;
//       }[] = dataUserLogin?.permissions || [];

//       return rawPermissions.reduce((acc: GroupedPermission[], curr) => {
//         const existing = acc.find((item) => item.menu_id === curr.menu_id);
//         if (existing) {
//           if (!existing.permissions.includes(curr.permission_type)) {
//             existing.permissions.push(curr.permission_type);
//           }
//         } else {
//           acc.push({
//             menu_id: curr.menu_id,
//             permissions: [curr.permission_type],
//           });
//         }
//         return acc;
//       }, []);
//     } catch {
//       console.warn("Failed to parse user_login_data in usePermission");
//       return [];
//     }
//   }, []);

//   const hasPermission = useMemo(() => {
//     return (menuId: number, permissionType: string): boolean => {
//       // Global manage (-1) check
//       if (
//         groupedPermissions.some(
//           (perm) => perm.menu_id === -1 && perm.permissions.includes("Manage")
//         )
//       ) {
//         return true;
//       }

//       const found = groupedPermissions.find((perm) => perm.menu_id === menuId);

//       return (
//         !!found &&
//         (found.permissions.includes("Manage") ||
//           found.permissions.includes(permissionType))
//       );
//     };
//   }, [groupedPermissions]);

//   return { hasPermission, permissions: groupedPermissions };
// };

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
      // Global manage (-1) check
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
