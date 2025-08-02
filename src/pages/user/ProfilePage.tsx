// ProfilePage.tsx (fixed version)
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit3, CreditCard, Settings, Lock,
  Shield, LogOut, ChevronRight, User,
} from "lucide-react";
import useUserStore from "@/store/user-store";
import { UserService } from "@/services/user-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const navigate = useNavigate();
  const rememberedCard = useUserStore((state) => state.rememberedCard);
  const setUser = useUserStore((state) => state.setUser);

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => UserService.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (profileData) {
      setUser(profileData.data.user);
    }
  }, [profileData, setUser]);

  const profile = profileData?.data.user;

  const handleLogout = async () => {
    try {
      await UserService.logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Try again.");
      console.error("Logout error:", error);
    }
  };

  if (isLoading) return <p className="p-6 text-center">Loading profile...</p>;
  if (isError || !profile) return <p className="p-6 text-center text-red-600">Failed to load profile.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={ ""} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Edit3 size={12} />
            </Button>
          </div>
          <div>
            <h2 className="text-xl mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-blue-200 text-sm">Member ID: {profile._id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 pb-6 space-y-4">
        {/* Personal Info */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-800">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-gray-800">{profile.phoneNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Plan */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              Insurance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Plan Name</p>
                <p className="text-gray-800">Premium Health Plan</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-gray-400" />
                <p className="text-gray-800">
                  {rememberedCard?.cardNumber || "No saved card"}
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate("/user/payment")}
            >
              Manage Payment
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} className="text-blue-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-gray-500" />
                <span className="text-sm">Change Password</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-3" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
