import CardComponent from "@/components/card/card";
import { WalletMinimal, ArrowRightCircle, Clock, Eye, FileText, Gift, Plus, RefreshCw, Shield, ShoppingCart } from "lucide-react";
import { Link, useNavigate, } from "react-router-dom";
import useUserStore from "@/store/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publicApi } from "@/lib/axios";
import { useEffect } from "react";

const Dashboard = () => {
  const setSelectedPlan = useUserStore((state) => state.setSelectedPlan);
  const selectedPlan = useUserStore((state) => state.selectedPlan);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await publicApi.get("/api/v1/plan/user");
        setSelectedPlan(res.data.data); // Adjust if shape differs
      } catch (err) {
        console.error("Failed to fetch selected plan", err);
      }
    };

    if (!selectedPlan) {
      fetchPlan();
    }
  }, [selectedPlan, setSelectedPlan]);

  const handleCardClick = () => {
    navigate("/users/plans");
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Wallet card */}
        <Link to="/users/wallet">
          <CardComponent
            title="Wallet"
            description={`₦${(user?.walletBalance ?? 0).toLocaleString()}`}
            bgColor="bg-purple-500"
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
          bgColor="bg-gray-300"
          onClick={handleCardClick}
        />
      </div>
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg mb-6">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={24} />
                <div>
                  <h3 className="text-lg">{selectedPlan?.name || "No Plan"}</h3>
                  <p className="text-red-100 text-sm">Comprehensive Coverage</p>
                </div>
              </div>
              <Badge className="bg-white text-red-600 hover:bg-red-50">
               {selectedPlan ? "Active" : "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText size={22} className="text-blue-600" />
              Insurance Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Type</p>
                <p className="text-gray-800">Health Insurance</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
                <p className="text-gray-800">{selectedPlan?.price.toLocaleString() || 0}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Number</p>
                <p className="text-gray-800">HI-2024-001234</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                <p className="text-gray-800">Every {selectedPlan?.period || ""}</p>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
              <Eye size={16} className="mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Horizontal Scrollable Section */}
        <div className="space-y-4">
          <h3 className="text-gray-800 px-1">Quick Access</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Claims Summary Card */}
            <Card className="min-w-[280px] shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock size={20} />
                  Claims Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Claims</span>
                  <Badge className="bg-orange-100 text-orange-700">
                    2
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved Claims</span>
                  <Badge className="bg-green-100 text-green-700">
                    8
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Claimed</span>
                  <span className="text-blue-700">$3,200</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="min-w-[280px] shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Plus size={20} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <Plus size={16} className="mr-2" />
                  File Claim
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  <RefreshCw size={16} className="mr-2" />
                  Renew Policy
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="sm">
                  <ShoppingCart size={16} className="mr-2" />
                  Buy Insurance
                </Button>
              </CardContent>
            </Card>

            {/* Referral Promo Card */}
            <Card className="min-w-[280px] shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Gift size={20} />
                 CashBack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-2xl text-purple-700 mb-1">&#8358;0</p>
                  <p className="text-sm text-gray-600 mb-3">For every money kept. you get 15% cashback</p>
                  <Badge className="bg-purple-600 text-white hover:bg-purple-700 mb-3">
                    Every 3 months
                  </Badge>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                  View CashBack
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>  
    </div>
  );
};

export default Dashboard;
