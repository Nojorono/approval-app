// import { useState, useEffect } from "react";

// export type GroupedPermission = {
//   menu_id: number;
//   permissions: string[];
// };

// export const usePermission = () => {
//   const [permissions, setPermissions] = useState<GroupedPermission[]>([]);

//   useEffect(() => {
//     // Ambil data user login dari localStorage
//     const storedUserLogin = localStorage.getItem("user_login_data");
//     if (!storedUserLogin) {
//       console.warn("No user_login_data found in localStorage.");
//       return;
//     }

//     const dataUserLogin = JSON.parse(storedUserLogin);
//     const rawPermissions = dataUserLogin?.permissions || [];

//     const groupedPermissions = rawPermissions.reduce(
//       (
//         acc: GroupedPermission[],
//         curr: { menu_id: number; permission_type: string }
//       ) => {
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
//       },
//       []
//     );
//     setPermissions(groupedPermissions);
//   }, []);

//   const hasPermission = (menuId: number, permissionType: string): boolean => {
//     // Cek jika ada global Manage (-1)
//     if (
//       permissions.some(
//         (perm) => perm.menu_id === -1 && perm.permissions.includes("Manage")
//       )
//     ) {
//       return true;
//     }

//     const found = permissions.find((perm) => perm.menu_id === menuId);
//     return (
//       !!found &&
//       (found.permissions.includes("Manage") ||
//         found.permissions.includes(permissionType))
//     );
//   };

//   return { hasPermission, permissions };
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
      const rawPermissions: {
        menu_id: number;
        permission_type: string;
      }[] = dataUserLogin?.permissions || [];

      return rawPermissions.reduce((acc: GroupedPermission[], curr) => {
        const existing = acc.find((item) => item.menu_id === curr.menu_id);
        if (existing) {
          if (!existing.permissions.includes(curr.permission_type)) {
            existing.permissions.push(curr.permission_type);
          }
        } else {
          acc.push({
            menu_id: curr.menu_id,
            permissions: [curr.permission_type],
          });
        }
        return acc;
      }, []);
    } catch {
      console.warn("Failed to parse user_login_data in usePermission");
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
