import React from "react";
import { generateRoutes } from "./generate-routes";
import AuthLayout from "@/layouts/authLayout";
import DashboardLayout from "@/layouts/dashboardLayout";
import SignIn from "@/pages/auth/signInPage";
import SignUpPage from "@/pages/auth/singUoOage";
import Dashboard from "@/pages/user/dashboard";
import ProtectedRoute from "./protected-routes";
import Wallet from "@/pages/user/wallet";
import Layout from "@/layouts/layout";
import ChatBotPage from "@/pages/user/chatBot";
import ClaimPage from "@/pages/user/claimPage";
import InsurancePage from "@/pages/user/PlanSelectionPage";

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
            path: "/",
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
        path: "/user/dashboard",
        layout: DashboardLayout,
        protected: true,
        routes: [
            {
                name: "User Dashboard",
                title: "User Dashboard",
                index: true,
                element: ProtectedDashboard,
            }
        ],
    },
    {
        layout: Layout,
        path: "/users",
        protected: true,
        routes: [
            {
                name: "Wallet",
                title: "Wallet",
                path: "wallet",
                element: Wallet,
            },
            {
                name: "ChatBot",
                title: "ChatBot",
                path: "chatbot",
                element: ChatBotPage,
            },
            {
                name: "Claims",
                title: "Claims",
                path: "claim",
                element: ClaimPage,
            },
            {
                name: "Plans",
                title: "Plans",
                path: "plans",
                element: InsurancePage,
            }
        ]
    }
]);
