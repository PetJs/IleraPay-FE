import React from "react";
import { Outlet } from "react-router-dom";
import { generateRoutes } from "./generate-routes";
import AuthLayout from "@/layouts/authLayout";
import DashboardLayout from "@/layouts/dashboardLayout";
import SignIn from "@/pages/auth/signInPage";
import { SignUpPage } from "@/pages/auth/singUoOage";
import Dashboard from "@/pages/user/dashboard";
import ProtectedRoute from "./protected-routes";

// Define wrappers as component types (not JSX elements)
const UsersRoutes: React.FC = () => <Outlet />;
const ProtectedDashboard: React.FC = () => (
  <ProtectedRoute isAuthorized={!!localStorage.getItem("userStore")}>   
    <Dashboard />
  </ProtectedRoute>
);

export const Routes = generateRoutes([
  {
    layout: AuthLayout,
    routes: [
      {
        name: "Sign In",
        title: "Sign In",
        path: "/signin",
        element: SignIn,             // pass component type
      },
      {
        name: "Sign Up",
        title: "Sign Up",
        path: "/signup",
        element: SignUpPage,
      },
      {
        name: "Root",
        title: "Root",
        path: "/",
        element: SignIn,
      },
      {
        name: "Not Found",
        title: "Not Found",
        path: "*",
        element: SignIn,
      },
    ],
  },
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "Users",
        title: "Users",
        path: "/users",
        element: UsersRoutes,
        requiredRole: "user",
        routes: [
          {
            name: "User Dashboard",
            title: "User Dashboard",
            path: "dashboard",
            element: ProtectedDashboard,
          },
        ],
      },
    ],
  },
]);
