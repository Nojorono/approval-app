import { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  isExpanded: boolean; // expanded / collapsed
  isMobile: boolean; // apakah mobile view
  isMobileOpen: boolean; // overlay sidebar di mobile
  isHovered: boolean; // hover expand
  activeItem: string | null; // menu aktif
  openSubmenu: string | null; // submenu terbuka
  toggleSidebar: () => void; // desktop expand/collapse
  toggleMobileSidebar: () => void; // buka/tutup mobile sidebar
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  closeAllSubmenus: () => void; // tambahan: menutup semua submenu
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // handle resize → deteksi mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsMobileOpen(false); // auto close sidebar kalau pindah ke desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsExpanded((prev) => !prev);
    }
  };

  const toggleMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    }
  };

  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  const closeAllSubmenus = () => {
    setOpenSubmenu(null);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobile,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        closeAllSubmenus,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
