import CardComponent from "@/components/card/card";
import { WalletMinimal } from "lucide-react";
import { ArrowRightCircle } from "lucide-react";

const handleCardClick = () => {
  console.log("Card clicked");
}

const Dashboard = () => (
  <div className="p-4">
    <div className="grid grid-cols-2 gap-4 ">
      <CardComponent title="Wallet" description="$2000" bgColor="bg-[#5D8AA8]" icon={<WalletMinimal/>} openIcon={<ArrowRightCircle/>}/>
      <CardComponent onClick={handleCardClick} description="$2000" bgColor="bg-[#FF4F00]"/>
      <CardComponent title="Wallet" description="$2000" bgColor="bg-[#AB274F]"/>
      <CardComponent title="Wallet" description="$2000" bgColor="bg-[#C0C0C0]"/>
    </div>
  </div>
);

export default Dashboard;