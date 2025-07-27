import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-white flex justify-between items-center p-2">
      <h1 className="text-xl font-bold">Good Evening, Jared</h1>
      <div className="flex justify-between gap-2 items-center">
        <p>Hi</p>
        <p>No</p>
      </div>
    </header>
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default DashboardLayout;