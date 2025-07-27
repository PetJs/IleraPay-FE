import React from "react";
import { generateRoutes } from "./generate-routes";
import AuthLayout from "@/layouts/authLayout";
import DashboardLayout from "@/layouts/dashboardLayout";
import SignIn from "@/pages/auth/signInPage";
import SignUpPage from "@/pages/auth/singUoOage";
import Dashboard from "@/pages/user/dashboard";
import ProtectedRoute from "./protected-routes";
import WelcomeBack from "@/pages/auth/welcomeBackPage";

const ProtectedDashboard: React.FC = () => {
  console.log("Protected Dashboard Rendered");
  return (
    <ProtectedRoute >
      <Dashboard />
    </ProtectedRoute>
  );
};

export const Routes = generateRoutes([
    {
        layout: AuthLayout,
        path: "/",
        routes: [
        {
            name: "Welcome Back",
            title: "Welcome Back",
            path: "signin",
            element: SignIn, 
        },
        {
            name: "Sign Up",
            title: "Sign Up",
            path: "signup",
            element: SignUpPage,
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
        path: "/user",
        layout: DashboardLayout,
        routes: [

            {
                name: "User Dashboard",
                title: "User Dashboard",
                path: "dashboard",
                element: ProtectedDashboard,
            },
        ],
    },
]);
