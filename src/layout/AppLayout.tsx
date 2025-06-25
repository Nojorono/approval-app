import { useMemo } from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const sidebarMargin = useMemo(() => {
    if (isMobileOpen) return "ml-0"; // Mobile always full width
    return isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]";
  }, [isExpanded, isHovered, isMobileOpen]);

  return (
    <div className="min-h-screen xl:flex transition-all duration-300 ease-in-out bg-gray-50">
      {/* Sidebar + Backdrop */}
      <div className="z-40">
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main Content */}
      <div
        className={`
          flex-1 overflow-x-hidden
          transition-all duration-300 ease-in-out 
          ${sidebarMargin}
        `}
      >
        <AppHeader />
        <main className="p-4 mx-auto max-w-screen-2xl md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;
