/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes as ReactRoutes, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./protected-routes";
import DashboardLayout from "@/layouts/dashboardLayout";
import useUserStore from "@/store/user-store";

type RouteConfig = {
  name?: string;
  path?: string;
  index?: boolean;
  element?: React.ComponentType<any>;
  title?: string;
  routes?: RouteConfig[];
};

type LayoutConfig = {
  layout: React.ComponentType<any>;
  routes: RouteConfig[];
  path?: string;
  protected?: boolean;
};

const renderRoutes = (
  routes: RouteConfig[],
  parentLayout?: React.ComponentType<any>,
  isAuthorized = true,
) => {
  return routes.map(
    (routeConfig, idx) => {
      const { element: Element, path, index, routes: nested, title, name } = routeConfig;
      if (!Element && !(nested && nested.length)) return null;

      // Determine protection
      const needsProtection = parentLayout === DashboardLayout;
      const elementNode = Element ? (
        needsProtection ? <ProtectedRoute><Element /></ProtectedRoute> : <Element />
      ) : undefined;

      // Build route props
      const routeProps: any = {};
      if (index) routeProps.index = true;
      else if (path) routeProps.path = path;
      if (title) routeProps.handle = { title };

      // Render nested or leaf
      if (nested && nested.length) {
        return (
          <Route key={idx} element={elementNode} {...routeProps}>
            {renderRoutes(nested, parentLayout, isAuthorized)}
          </Route>
        );
      }

      return (
        <Route
          key={name || idx}
          element={elementNode}
          {...routeProps}
        />
      );
    }
  );
};

export const generateRoutes = (mainRoutes: LayoutConfig[]) => {
  const Routes = () => {
    const { authorized } = useUserStore();

    return (
      <ReactRoutes>
        {mainRoutes.map(({ layout: Layout, path, protected: gate, routes }, idx) => (
          <Route
            key={idx}
            path={path}
            element={gate ? <ProtectedRoute><Layout /></ProtectedRoute> : <Layout />}
          >
            {renderRoutes(routes, Layout, authorized)}
          </Route>
        ))}

        <Route
          path="/"
          element={
            !authorized ? <Navigate to="/" replace /> : <Navigate to="/user/dashboard" replace />
          }
        />

        <Route
          path="/admin/*"
          element={<ProtectedRoute><Outlet /></ProtectedRoute>}
        />

        <Route
          path="/users/*"
          element={<ProtectedRoute><Outlet /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </ReactRoutes>
    );
  };

  return Routes;
};
