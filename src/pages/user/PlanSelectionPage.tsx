import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlanCard } from "@/components/PlanCard";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { PaymentData, Plan } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/user-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user-service";

export default function InsurancePage() {
  const navigate = useNavigate();
  const { setSelectedPlan } = useUserStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["insurancePlans"],
    queryFn: async () => {
      const res = await UserService.getAllInsurancePlans();
      return res.data as Plan[]; // 👈 explicitly cast to Plan[]
    }
  });

  const insurancePlans = data || [];

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    rememberCard: false,
    bankTransferCompleted: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  const selectedPlan = insurancePlans.find(plan => plan.id === selectedPlanId);

  const isPaymentValid = (): boolean => {
    if (paymentData.method === 'card') {
      return (
        paymentData.cardNumber.length >= 15 &&
        !!paymentData.cardholderName &&
        paymentData.expiryDate.length === 5 &&
        paymentData.cvv.length === 3
      );
    } else {
      return paymentData.bankTransferCompleted;
    }
  };

  const isFormValid = (): boolean => selectedPlanId !== '' && isPaymentValid();

  const { mutate, isPending } = useMutation({
    mutationFn: () => UserService.subscribeToPlan({ planId: selectedPlanId, payment: paymentData }),
 // ✅ backend expects just a planId string
    onSuccess: () => {
      if (selectedPlan) {
        setSelectedPlan({ ...selectedPlan, startDate: new Date().toISOString() });
      }
      setIsSubscribed(true);
      toast.success("Subscription successful!");
    },
    onError: () => toast.error("Subscription failed. Please try again."),
  });

  const handleSubscribe = () => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields");
      return;
    }
    mutate();
  };

  const handleNewSubscription = () => {
    setSelectedPlanId('');
    setPaymentData({
      method: 'card',
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      rememberCard: false,
      bankTransferCompleted: false
    });
    setIsSubscribed(false);
  };

  const handleViewCoverage = () => navigate("/user/dashboard");

  if (isLoading) return <p className="text-center p-6">Loading plans...</p>;
  if (isError) return <p className="text-center text-red-600 p-6">Failed to load plans.</p>;

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center p-4">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Subscription Successful!</h2>
            <p className="text-muted-foreground mb-2">Welcome to {selectedPlan?.name}!</p>
            <p className="text-sm text-muted-foreground mb-6">Your insurance is now active. You'll receive a confirmation email shortly.</p>
            <div className="space-y-3">
              <Button onClick={handleNewSubscription} variant="outline" className="w-full">Choose Another Plan</Button>
              <Button className="w-full" onClick={handleViewCoverage}>View My Coverage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pt-12 pb-12">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl">Select Your Insurance Plan</h2>
            <div className="space-y-4">
              {insurancePlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} isSelected={selectedPlanId === plan.id} onSelect={setSelectedPlanId} />
              ))}
            </div>
          </div>

          {selectedPlanId && (
            <PaymentMethodForm
              onPaymentDataChange={setPaymentData}
              isValid={isPaymentValid()} // ✅ make sure it's a boolean
            />
          )}

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">{selectedPlan.name}</p>
                    <p className="text-sm text-muted-foreground">Billed {selectedPlan.period}ly</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{selectedPlan.price}/{selectedPlan.period}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount Due</p>
                    <p className="text-lg font-semibold">{selectedPlan.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pb-12">
            <Button
              onClick={handleSubscribe}
              disabled={!isFormValid() || isPending}
              className="w-full h-12"
            >
              {isPending
                ? "Processing..."
                : paymentData.method === 'bank'
                  ? "Confirm Payment"
                  : "Subscribe Now"}
            </Button>

            {!isFormValid() && selectedPlanId && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                {!isPaymentValid()
                  ? paymentData.method === 'card'
                    ? "Please complete payment information"
                    : "Please confirm your bank transfer"
                  : "Please select a plan"}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
