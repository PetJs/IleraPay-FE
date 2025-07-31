import { useState } from "react";
import Inspo from "../../assets/images/inspo-removebg-preview.png";
import TransactionHistory from "./TransactionPage";
import ClaimsMade from "./ClaimsPage";


const Wallet = () => {
  // track which tab is active
  const [activeTab, setActiveTab] = useState<"history" | "claims">("history");

  return (
    <div className="h-screen flex flex-col">
      {/* Top wallet header */}
      <div className="bg-purple-500 h-[40vh] flex p-2 pt-14">
        <div className="w-1/2 h-full space-y-2">
          <p>Hi Abdul</p>
          <p className="text-3xl font-extrabold text-white mb-12">
            &#8358;{(4000).toFixed(2)}
          </p>
          <button className="rounded-4xl px-6 py-2 text-lg bg-purple-300">
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
