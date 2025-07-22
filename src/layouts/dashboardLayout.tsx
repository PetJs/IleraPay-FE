import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-white shadow p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
    </header>
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default DashboardLayout;