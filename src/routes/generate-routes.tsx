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
              <ProtectedRoute>
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
        {mainRoutes.map(({ layout: Layout, path: layoutPath, routes }, idx) => (
        <Route
          key={idx}
          path={layoutPath}        // ← bind this layout to its URL prefix
          element={<Layout />}
        >
          {renderRoutes(routes, Layout, isAuthorized)}
        </Route>
      ))}

        <Route
          path="/"
          element={
            !isAuthorized  ? (
              <Navigate to="/signin" replace />
            ) :  (
              <Navigate to="/user" replace />
            )
          }
        />

        {/* Restrict admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute  >
              <Outlet />
            </ProtectedRoute>
          }
        />

        {/* Restrict user routes */}
        <Route
          path="/users/*"
          element={
            <ProtectedRoute >
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
