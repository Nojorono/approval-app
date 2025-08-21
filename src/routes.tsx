import { JSX, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import { signOut } from "./utils/SignOut";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useAuthStore } from "./API/store/AuthStore/authStore";
import { ProtectedRoute } from "./utils/ProtectedRoute";

// Pages...
import {
  MasterMenu,
  MasterUser,
  MasterRole,
  CreateRole,
  UpdateRole,
  ApprovalRequest,
  ApprovalProcess,
  Dashboard,
} from "./utils/PagesComponent";

import ApprovalProcessDetail from "./pages/ApprovalProcess/ApprovalProcessDetail";
import ApprovalProcessResult from "./pages/ApprovalProcess/ApprovalProcessResult";
import ApprovalPage from "./pages/ApprovalPage";

const DefaultPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Halaman ini masih dalam proses development</h1>
  </div>
);

export function AppRoutes() {
  const navigate = useNavigate();
  const token =
    useAuthStore((state) => state.accessToken) ||
    localStorage.getItem("accessToken");

  const localUserMenus = useMemo(() => {
    const stored = localStorage.getItem("user_login_data");
    try {
      return stored && stored !== "undefined"
        ? JSON.parse(stored).menus ?? []
        : [];
    } catch {
      console.warn("Failed to parse user_login_data");
      return [];
    }
  }, []);

  const userMenus = useAuthStore((state) => state.menus) || localUserMenus;

  const isAuthenticated = () => {
    if (token) {
      localStorage.setItem("accessToken", token);
      return true;
    }
    return false;
  };

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     signOut(navigate);
  //   }
  // }, [navigate]);

  const manualChildRoutes: Record<
    string,
    { path: string; element: JSX.Element }[]
  > = {
    "/role": [
      { path: "create", element: <CreateRole /> },
      { path: "update", element: <UpdateRole /> },
    ],
  };

  const getElementByPath = (path: string): JSX.Element | null => {
    const map: Record<string, JSX.Element> = {
      "/user": <MasterUser />,
      "/menu": <MasterMenu />,
      "/role": <MasterRole />,
      "/approval-request": <ApprovalRequest />,
      "/approval-page": <ApprovalPage />,
      "/dashboard": <Dashboard />,
    };
    return map[path] || <DefaultPage />;
  };

  const userRoutes = useMemo(() => {
    const routes: { id: string; path: string; element: JSX.Element }[] = [];

    const traverse = (items: any[]) => {
      items.forEach((item) => {
        if (item.path) {
          const Element = getElementByPath(item.path);
          if (Element) {
            routes.push({
              id: item.id || item.path,
              path: item.path,
              element: Element,
            });
          }

          const childRoutes = manualChildRoutes[item.path];
          if (childRoutes) {
            childRoutes.forEach((child) => {
              routes.push({
                id: `${item.path}-${child.path}`,
                path: `${item.path}/${child.path}`,
                element: child.element,
              });
            });
          }

          if (item.children?.length) {
            traverse(item.children);
          }
        }
      });
    };

    traverse(userMenus);
    return routes;
  }, [userMenus]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {isAuthenticated() ? (
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<SignIn />} />
            {userRoutes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}

        <Route path="/signin" element={<SignIn />} />
        <Route path="/approval-process/:id" element={<ApprovalProcess />} />
        <Route path="/approval-process/detail" element={<ApprovalProcessDetail />} />
        <Route path="/approval-process/result" element={<ApprovalProcessResult />} />

      </Routes>
    </>
  );
}
