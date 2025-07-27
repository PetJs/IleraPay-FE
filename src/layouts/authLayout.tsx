import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="h-screen bg-red-500 flex  justify-end pt-32">
    <Outlet/>
  </div>
);

export default AuthLayout;