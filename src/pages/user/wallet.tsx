import { useState } from "react";
import Inspo from "../../assets/images/inspo-removebg-preview.png";
import TransactionHistory from "./TransactionPage";
import ClaimsMade from "./ClaimsPage";
import useUserStore from "@/store/user-store";
import { UserService } from "@/services/user-service";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState<"history" | "claims">("history");
  const user = useUserStore((state) => state.user);

  const onTopUpClick = async () => {
    if (!user?.email) return alert("User email is missing");

    try {
      const res = await UserService.initializePayment({
        amount: 10000, // Replace with user input if dynamic
        email: user.email,
        metadata: {},
      });

      if (res?.data?.authorization_url) {
        window.location.href = res.data.authorization_url; // Redirect to Paystack
      } else {
        alert("Failed to initialize payment");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong initializing payment.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top wallet header */}
      <div className="bg-purple-500 h-[40vh] flex p-2 pt-14">
        <div className="w-1/2 h-full space-y-2">
          <p>Hi {user?.firstName || "User"}</p>
          <p className="text-3xl font-extrabold text-white mb-12">
            &#8358;{user?.walletBalance?.toLocaleString() ?? 0}
          </p>
          <button
            onClick={onTopUpClick}
            className="rounded-4xl px-6 py-2 text-lg bg-purple-300"
          >
            Top Up
          </button>
        </div>
        <div className="w-1/2 h-full">
          <img
            src={Inspo}
            alt="Inspiration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tab selectors */}
      <div className="mt-4 p-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("history")}
          className={`mr-4 pb-1 ${
            activeTab === "history"
              ? "border-b-2 border-purple-500 font-semibold"
              : "text-gray-600"
          }`}
        >
          Transaction History
        </button>
        <button
          onClick={() => setActiveTab("claims")}
          className={`pb-1 ${
            activeTab === "claims"
              ? "border-b-2 border-purple-500 font-semibold"
              : "text-gray-600"
          }`}
        >
          Claims Made
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "history" ? <TransactionHistory /> : <ClaimsMade />}
      </div>
    </div>
  );
};

export default Wallet;
