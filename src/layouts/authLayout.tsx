import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="h-screen bg-red-500">
    <Outlet/>
  </div>
);

export default AuthLayout;