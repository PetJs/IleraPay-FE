/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes as ReactRoutes, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./protected-routes";
import DashboardLayout from "@/layouts/dashboardLayout";
import useUserStore from "@/store/user-store";

type RouteConfig = {
  name?: string;
  path: string;
  element?: React.ComponentType<any>;
  title?: string;
  routes?: RouteConfig[]; // Nested routes
};

type LayoutConfig = {
  layout: React.ComponentType<any>;
  routes: RouteConfig[];
  path?: string;
};

const renderRoutes = (
  routes: RouteConfig[],
  parentLayout?: React.ComponentType<any>,
  isAuthorized = true,
) => {
  return routes.map(
    ({ element: Element, path, routes: nestedRoutes, name }, index) => {
      if (!Element || !path) return null;

      // Check if route needs protection
      const needsProtection = parentLayout === DashboardLayout;
      const isAccessible = isAuthorized && (!needsProtection );

      if (nestedRoutes && nestedRoutes.length > 0) {
        return (
          <Route key={`${path}-${index}`} path={path} element={<Element />}>
            {renderRoutes(nestedRoutes, parentLayout, isAuthorized)}
          </Route>
        );
      }

      return (
        <Route
          key={name || `route-${index}`}
          path={path}
          element={
            needsProtection ? (
              <ProtectedRoute
                isAuthorized={isAccessible}
              >
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )
          }
        />
      );
    }
  );
};


export const generateRoutes = (mainRoutes: LayoutConfig[]) => {
  const Routes = () => {
    const { authorized: isAuthorized } = useUserStore();
    console.log("Authorized:", isAuthorized);

    return (
      <ReactRoutes>
        {mainRoutes.map(({ layout: Layout, routes }, index) => (
          <Route key={`layout-${index}`} element={<Layout />}>
            {renderRoutes(routes, Layout, isAuthorized)}
          </Route>
        ))}

        <Route
          path="/"
          element={
            !isAuthorized  ? (
              <Navigate to="/" replace />
            ) :  (
              <Navigate to="/users" replace />
            )
          }
        />

        {/* Restrict admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAuthorized={isAuthorized} >
              <Outlet />
            </ProtectedRoute>
          }
        />

        {/* Restrict user routes */}
        <Route
          path="/users/*"
          element={
            <ProtectedRoute isAuthorized={isAuthorized}>
              <Outlet />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </ReactRoutes>
    );
  };

  return Routes;
};
