import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="h-screen flex bg-gray-300 justify-end pt-32">
    <Outlet/>
  </div>
);

export default AuthLayout;