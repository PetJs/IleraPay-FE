// components/BottomNav.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid as DashboardIcon,
  CreditCard as BillingIcon,
  Bot as BotIcon,
  ClipboardList as ClaimsIcon,
  Shield as InsuranceIcon
} from "lucide-react";

const tabs = [
  { to: "/user/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { to: "/users/wallet",   label: "Wallet",   Icon: BillingIcon   },
  { to: "/users/chatbot",    label: "ChatBot", Icon: BotIcon   },
  { to: "/users/claim",    label: "Claims",    Icon: ClaimsIcon    },
  { to: "/users/plans",    label: "Claims",    Icon: InsuranceIcon    },
];

const BottomNav: React.FC = () => (
  <nav className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-inner">
    <ul className="flex justify-around">
      {tabs.map(({ to, label, Icon }) => (
        <li key={to} className="flex-1">
          <NavLink
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-2 transition-colors 
               ${isActive 
                 ? "text-purple-600"       // active color
                 : "text-gray-500 hover:text-gray-700"}`
            }
          >
            <Icon size={24}  />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
