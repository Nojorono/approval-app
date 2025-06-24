import { useMemo } from "react";
import * as Icons from "react-icons/fa";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

export type MenuItem = {
  icon: string;
  id: string | number;
  name: string;
  path?: string;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
};

// Helper: format name from camelCase to "Camel Case"
const formatName = (name: string): string =>
  name.replace(/([A-Z])/g, " $1").trim();

// Helper: safely resolve icon
const resolveIcon = (iconName: string): React.ReactNode => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  return IconComponent ? <IconComponent /> : <Icons.FaFile />;
};

// Helper: build hierarchy from flat menu
const buildMenuHierarchy = (menuItems: MenuItem[]): MenuItem[] => {
  const menuMap: Record<string | number, MenuItem> = {};
  menuItems.forEach((menu) => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  const rootMenus: MenuItem[] = [];
  menuItems.forEach((menu) => {
    if (menu.parentId) {
      const parent = menuMap[menu.parentId];
      if (parent) parent.children?.push(menuMap[menu.id]);
    } else {
      rootMenus.push(menuMap[menu.id]);
    }
  });

  return rootMenus;
};

// Helper: get local storage value safely
const getParsedLocalStorage = (key: string): any => {
  const value = localStorage.getItem(key);
  try {
    return value && value !== "undefined" ? JSON.parse(value) : null;
  } catch {
    console.warn(`Failed to parse localStorage for key: ${key}`);
    return null;
  }
};

export const useDynamicSidebarItems = (): NavItem[] => {
  const localMenus: MenuItem[] = useMemo(() => {
    return getParsedLocalStorage("local_menus") ?? [];
  }, []);

  const userLoginMenus: MenuItem[] | null = useMemo(() => {
    const userData = getParsedLocalStorage("user_login_data");
    return userData?.menus ?? null;
  }, []);

  const navItems: NavItem[] = useMemo(() => {
    const effectiveMenus = userLoginMenus?.length ? userLoginMenus : localMenus;

    if (!effectiveMenus || effectiveMenus.length === 0) return [];

    const menuHierarchy = buildMenuHierarchy(effectiveMenus);

    const items: NavItem[] = menuHierarchy.map((parent) => {
      const baseItem: NavItem = {
        name: formatName(parent.name),
        icon: resolveIcon(parent.icon),
        path: parent.path || "",
      };

      if (parent.children && parent.children.length > 0) {
        baseItem.subItems = parent.children.map((child) => ({
          name: formatName(child.name),
          path: child.path || "",
        }));
      }

      return baseItem;
    });

    return items.sort((a, b) => {
      const aHasChildren = !!a.subItems?.length;
      const bHasChildren = !!b.subItems?.length;
      return aHasChildren === bHasChildren ? 0 : aHasChildren ? -1 : 1;
    });
  }, [localMenus, userLoginMenus]);

  return navItems;
};

// import { useMemo } from "react";
// import * as Icons from "react-icons/fa"; // Import semua ikon dari react-icons/fa
// // import dummyRoutes from "../helper/dummyRoutes";

// export type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string }[];
// };

// export type MenuItem = {
//   icon: string; // Pastikan kolom icon adalah string
//   id: string | number;
//   name: string;
//   path?: string;
//   order: number;
//   parentId: string | null;
//   children?: MenuItem[];
// };

// // Fungsi untuk membangun hierarki menu berdasarkan id dan parentId
// const buildMenuHierarchy = (menuItems: MenuItem[]): MenuItem[] => {
//   const menuMap: { [key: string]: MenuItem } = {};

//   // Buat map dari menu berdasarkan id
//   menuItems.forEach((menu) => {
//     menuMap[menu.id] = { ...menu, children: [] };
//   });

//   const rootMenus: MenuItem[] = [];

//   // Hubungkan parent dan children
//   menuItems.forEach((menu) => {
//     if (menu.parentId) {
//       const parent = menuMap[menu.parentId];
//       if (parent) {
//         parent.children?.push(menuMap[menu.id]);
//       }
//     } else {
//       rootMenus.push(menuMap[menu.id]); // Menu tanpa parentId menjadi root
//     }
//   });

//   return rootMenus;
// };

// export const useDynamicSidebarItems = (): NavItem[] => {
//   const localMenus: MenuItem[] = useMemo(() => {
//     const storedMenus = localStorage.getItem("local_menus");
//     try {
//       return storedMenus && storedMenus !== "undefined"
//         ? JSON.parse(storedMenus)
//         : [];
//     } catch {
//       console.warn("Failed to parse local_menus from localStorage.");
//       return [];
//     }
//   }, []);

//   const user_login_menu = (() => {
//     const storedUserLogin = localStorage.getItem("user_login_data");
//     return storedUserLogin && storedUserLogin !== "undefined"
//       ? JSON.parse(storedUserLogin).menus
//       : null;
//   })();

//   const navItems = useMemo(() => {
//     const effectiveMenus =
//       user_login_menu && user_login_menu.length > 0
//         ? user_login_menu
//         : localMenus;

//     // const effectiveMenus = dummyRoutes.map((menu) => ({
//     //   ...menu,
//     //   parentId: menu.parentId !== null ? String(menu.parentId) : null,
//     // }));

//     if (!effectiveMenus || effectiveMenus.length === 0) return [];

//     // Bangun hierarki menu
//     const menuHierarchy = buildMenuHierarchy(effectiveMenus);

//     // Proses hierarki menu menjadi NavItem
//     const processedNavItems = menuHierarchy.map((parent: MenuItem): NavItem => {
//       const resolveIcon = (iconName: string): React.ReactNode => {
//         const IconComponent = Icons[iconName as keyof typeof Icons];
//         return IconComponent ? <IconComponent /> : <Icons.FaFile />;
//       };

//       // Jika menu tidak memiliki children, jadikan menu tunggal
//       if (!parent.children || parent.children.length === 0) {
//         return {
//           name: parent.name.replace(/([A-Z])/g, " $1").trim(),
//           icon: resolveIcon(parent.icon),
//           path: parent.path || "",
//         };
//       }

//       // Jika menu memiliki children, jadikan menu dengan dropdown
//       const subItems = parent.children.map((child) => ({
//         name: child.name.replace(/([A-Z])/g, " $1").trim(),
//         path: child.path || "",
//       }));

//       return {
//         name: parent.name.replace(/([A-Z])/g, " $1").trim(),
//         icon: resolveIcon(parent.icon),
//         path: parent.path || "",
//         subItems,
//       };
//     });

//     // Urutkan menu: yang memiliki children di atas
//     return processedNavItems.sort((a, b) => {
//       const aHasChildren = a.subItems && a.subItems.length > 0;
//       const bHasChildren = b.subItems && b.subItems.length > 0;
//       return aHasChildren === bHasChildren ? 0 : aHasChildren ? -1 : 1;
//     });
//   }, [localMenus]);

//   return navItems;
// };
