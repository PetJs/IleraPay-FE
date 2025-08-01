import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Copy, CreditCard, Building2, HelpCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import MC from "../assets/images/mc_symbol.svg"
import type { PaymentData } from "@/lib/types";
import { useNavigate } from "react-router-dom";



interface PaymentMethodFormProps {
  onPaymentDataChange: (data: PaymentData) => void;
  isValid: boolean;
}

export function PaymentMethodForm({ onPaymentDataChange, isValid }: PaymentMethodFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    rememberCard: false,
    bankTransferCompleted: false
  });

  const navigate = useNavigate();

  const handleInputChange = (field: keyof PaymentData, value: string | boolean) => {
    const newData = { ...paymentData, [field]: value };
    setPaymentData(newData);
    onPaymentDataChange(newData);
  };

  const handleMethodChange = (value: string) => {
    const method = value as 'card' | 'bank';
    const newData = { ...paymentData, method };
    setPaymentData(newData);
    onPaymentDataChange(newData);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleBankTransferComplete = () => {
    const newData = { ...paymentData, bankTransferCompleted: true };
    setPaymentData(newData);
    onPaymentDataChange(newData);
    toast.success("Payment marked as completed!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentData.method} onValueChange={handleMethodChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card" className="flex items-center gap-2 ">
              <CreditCard className="w-4 h-4" />
              Credit Card
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Transfer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  handleInputChange('cardNumber', formatted);
                }}
                maxLength={19}
              />
              <div className="flex gap-2 mt-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                  <img src={MC}/>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    handleInputChange('expiryDate', formatted);
                  }}
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="cvv">CVV</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>3 digits on the back of your card</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberCard"
                checked={paymentData.rememberCard}
                onCheckedChange={(checked: boolean) => handleInputChange('rememberCard', checked as boolean)}
              />
              <Label htmlFor="rememberCard" className="text-sm">
                Remember this card
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-4 mt-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bank:</span>
                <span>First Bank of Nigeria</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Account Name:</span>
                <span>Insurance App Ltd.</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span>1234567890</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('1234567890')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm mb-2">
                <strong>Reference:</strong> Use your User ID as reference: 
                <span className="font-mono bg-white px-2 py-1 rounded ml-1">
                  #USER12345
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('#USER12345')}
                  className="h-6 w-6 p-0 ml-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </p>
              <p className="text-xs text-muted-foreground">
                Note: Verification may take up to 24 hours.
              </p>
            </div>
            
            {!paymentData.bankTransferCompleted ? (
              <Button onClick={handleBankTransferComplete} variant="outline" className="w-full text-white bg-purple-500">
                I Have Paid
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">Payment marked as completed</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="p-4">
        <Button onClick={() => navigate("/users/dashboard")} className="w-full">
          View My Coverage
        </Button>
      </div>
    </Card>
  );
}