import CardComponent from "@/components/card/card";
import { WalletMinimal } from "lucide-react";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";



const Dashboard = () => {

  const handleCardClick = () => {
    console.log("Card clicked");
  }

  return (

    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 ">
        <Link to="/users/wallet">
          <CardComponent title="Wallet" description="&#8358;2000" bgColor="bg-[#5D8AA8]" icon={<WalletMinimal/>} openIcon={<ArrowRightCircle/>}/> 
        </Link>
        
        <CardComponent onClick={handleCardClick} description="&#8358;2000" bgColor="bg-[#FF4F00]"/>
        <CardComponent title="Wallet" description="&#8358;2000" bgColor="bg-[#AB274F]"/>
        <CardComponent title="Wallet" description="&#8358;2000" bgColor="bg-[#C0C0C0]"/>
      </div>
    </div>
  )
};

export default Dashboard;