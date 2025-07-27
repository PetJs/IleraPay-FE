import {User} from "lucide-react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-white flex justify-between items-center p-2">
      <h1 className="text-xl font-bold">Good Evening, Jared</h1>
      <div className="flex justify-between gap-2 items-center">
        <p>Hi</p>
        <User className="w-8 h-8 text-gray-700" fill="blue" stroke="" />
      </div>
    </header>
    <Outlet/>
  </div>
);

export default DashboardLayout;