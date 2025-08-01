import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Edit3,
  User,
//   Phone,
//   Mail,
//   MapPin,
  FileText,
//   Clock,
  CreditCard,
//   Users,
  Settings,
  Lock,
  Bell,
  Fingerprint,
  Globe,
  Palette,
  HelpCircle,
  Shield,
//   Eye,
  LogOut,
  ChevronRight,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Calendar,
//   DollarSign
} from 'lucide-react';
import useUserStore from '@/store/user-store';
import { UserService } from '@/services/user-service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const navigate = useNavigate();
    const rememberedCard = useUserStore((state) => state.rememberedCard);
    const selectedPlan = useUserStore((state) => state.selectedPlan);
//   const claimsHistory = [
//     {
//       id: "CLM-2024-001",
//       status: "Approved",
//       amount: "$1,250",
//       date: "Jan 15, 2024",
//       statusColor: "text-green-600",
//       bgColor: "bg-green-100",
//       icon: CheckCircle
//     },
//     {
//       id: "CLM-2024-002", 
//       status: "Pending",
//       amount: "$850",
//       date: "Jan 28, 2024",
//       statusColor: "text-orange-600",
//       bgColor: "bg-orange-100",
//       icon: AlertCircle
//     },
//     {
//       id: "CLM-2023-089",
//       status: "Rejected",
//       amount: "$450",
//       date: "Dec 12, 2023",
//       statusColor: "text-red-600",
//       bgColor: "bg-red-100",
//       icon: XCircle
//     }
//   ];

//   const beneficiaries = [
//     { name: "Sarah Anderson", relationship: "Spouse" },
//     { name: "Michael Anderson", relationship: "Son" },
//     { name: "Emily Anderson", relationship: "Daughter" }
//   ];

    const handleLogout = async () => {
        try {
            await UserService.logout();
            toast.success("Logged out successfully");
            navigate("/"); // redirect to login page
        } catch (error) {
            toast.error("Logout failed. Try again.");
            console.error("Logout error:", error);
        }
    };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl"> 
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="bg-blue-500 text-white text-xl">JA</AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Edit3 size={12} />
            </Button>
          </div>
          <div>
            <h2 className="text-xl mb-1">John Anderson</h2>
            <p className="text-blue-200 text-sm">Member ID: INS-2024-7891</p>
          </div>
        </div>
      </div>

      <div className="px-4mt-6 pb-6 space-y-4">
        {/* Personal Information Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User size={20} className="text-blue-600" />
              Personal Information
            </CardTitle>
            {/* <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Edit3 size={14} />
            </Button> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-800">John Anderson</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="text-gray-800">March 15, 1985</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-gray-800">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-800">john.anderson@email.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-gray-800">123 Main Street, Apt 4B<br />New York, NY 10001</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Details Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Shield size={20} className="text-blue-600" />
              Insurance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Name</p>
                <p className="text-gray-800">{selectedPlan?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Number</p>
                <p className="text-gray-800">HI-2024-001234</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
                <p className="text-gray-800">$100,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Policy Status</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
              </div>
            </div>

            {/* <div>
              <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
              <p className="text-gray-800">December 31, 2024</p>
            </div> */}

            {/* <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
              <Eye size={16} className="mr-2" />
              View Policy
            </Button> */}
          </CardContent>
        </Card>

        {/* Claims History Section */}
        {/* <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock size={20} className="text-blue-600" />
              Claims History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {claimsHistory.map((claim) => {
              const StatusIcon = claim.icon;
              return (
                <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${claim.bgColor}`}>
                      <StatusIcon size={16} className={claim.statusColor} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{claim.id}</p>
                      <p className="text-xs text-gray-500">{claim.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">{claim.amount}</p>
                    <Badge variant="secondary" className={`text-xs ${claim.statusColor} bg-transparent`}>
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
            
            {/* <Button variant="outline" className="w-full mt-3 text-blue-600 border-blue-200 hover:bg-blue-50">
              See All Claims
            </Button> */}
          {/* </CardContent>
        </Card>  */}

        {/* Payment Info Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CreditCard size={20} className="text-blue-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-gray-400" />
                <p className="text-gray-800">{rememberedCard?.cardNumber}</p>
              </div>
              <p className='text-sm text-gray-500 mb-1'>Holder Name</p>
              <p className='text-gray-80-'>{rememberedCard?.cardholderName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Recent Payments</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Premium Payment</span>
                  <span className="text-sm text-gray-800">&#8358;89.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jan 15, 2024</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    Paid
                  </Badge>
                </div>
              </div>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              <CreditCard size={16} className="mr-2" />
              Manage Payment
            </Button>
          </CardContent>
        </Card>

        {/* Beneficiaries Card */}
        {/* <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users size={20} className="text-blue-600" />
              Beneficiaries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-800">{beneficiary.name}</p>
                  <p className="text-xs text-gray-500">{beneficiary.relationship}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-3 text-blue-600 border-blue-200 hover:bg-blue-50">
              <Users size={16} className="mr-2" />
              Add / Edit Beneficiaries
            </Button>
          </CardContent>
        </Card> */}

        {/* Settings Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Settings size={20} className="text-blue-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Change Password</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Biometric Login</span>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Language</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">English</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Theme</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Light</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Help & Support</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Terms & Conditions</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Privacy Policy</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <Separator />
            
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
              <LogOut size={16} className="mr-3"  />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}