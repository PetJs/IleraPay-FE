import {User} from "lucide-react";
import { Outlet, useNavigate} from "react-router-dom";

const date = new Date()
const hours = date.getHours();
const greeting = hours < 12 ? "Morning" : hours < 18 ? "Afternoon" : "Evening";


const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/users/profile");
  };
  
  return (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-white flex justify-between items-center p-2">
      <h1 className="text-xl font-bold">Good {greeting}, Jared</h1>
      <div className="flex justify-between gap-2 items-center">
        <p>Hi</p>
        <User className="w-8 h-8 text-gray-700" fill="blue" stroke="" onClick={handleCardClick} />
      </div>
    </header>
    <Outlet/>
  </div>
  )
};

export default DashboardLayout;