import CardComponent from "@/components/card/card";
import { WalletMinimal, ArrowRightCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "@/store/user-store";

const Dashboard = () => {
  const navigate = useNavigate();
  const selectedPlan = useUserStore((state) => state.selectedPlan);

  const handleCardClick = () => {
    navigate("/users/plans");
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Wallet card */}
        <Link to="/users/wallet">
          <CardComponent
            title="Wallet"
            description="&#8358;2000"
            bgColor="bg-[#5D8AA8]"
            icon={<WalletMinimal />}
            openIcon={<ArrowRightCircle />}
          />
        </Link>

        {/* Selected plan card with button */}
        <CardComponent
          title={selectedPlan?.name || "No Plan"}
          description={
            selectedPlan
              ? `${selectedPlan.price.toLocaleString()} / ${selectedPlan.period}`
              : "Choose a plan"
          }
          bgColor="bg-[#FF4F00]"
          onClick={handleCardClick}
        />

        {/* Placeholder cards */}
        <CardComponent title="Wallet" description="&#8358;2000" bgColor="bg-[#AB274F]" />
        <CardComponent title="Wallet" description="&#8358;2000" bgColor="bg-[#C0C0C0]" />
      </div>
    </div>
  );
};

export default Dashboard;
