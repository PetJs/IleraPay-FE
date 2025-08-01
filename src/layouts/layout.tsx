import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { User } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/bottomNav";

const titleMap: Record<string, string> = {
  "/users/wallet":    "User Wallet",
  // …etc
};

const Layout = () => {
  const { pathname } = useLocation();
  const title = titleMap[pathname] || "";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen relative flex flex-col bg-gray-100">
      <header className=" flex justify-between items-center p-2 absolute top-0 left-0 right-0  ">
        <div onClick={() => navigate(-1)}>
          <ChevronLeft/>
        </div>
        <h1>{title}</h1>
        <div><Link to="/users/profile"><User className="w-8 h-8 text-gray-700" fill="blue" stroke="" /></Link></div>
      </header>
      <Outlet />

      <div className="fixed bottom-0 left-0 p-4">
        <BottomNav/>
      </div>
    </div>
  );
};

export default Layout;
