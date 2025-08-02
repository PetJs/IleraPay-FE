"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useUserStore from "@/store/user-store";
import { cn } from "@/lib/utils";
import { CreditCard, Wallet } from "lucide-react";
import { UserService } from "@/services/user-service";
import { useNavigate } from "react-router-dom";

type FormData = {
  paymentMethod: "card" | "wallet";
};

const PaymentMethodForm = () => {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "wallet">("card");
  const { user, selectedPlan } = useUserStore();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const handlePlanPayment = async () => {
    if (!user?.email || !selectedPlan) {
      toast.error("User or plan data missing");
      return;
    }

    try {
      const res = await UserService.initializePayment({
        amount: selectedPlan.amount * 100,
        email: user.email,
        metadata: {
          planId: selectedPlan.id,
          userId: user.id,
        },
      });

      if (res?.data?.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        toast.error("Failed to initialize payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while processing payment.");
    }
  };

  useEffect(() => {
    register("paymentMethod", { required: true });
  }, [register]);

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-lg font-semibold">Select Payment Method</h2>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value: "card" | "wallet") => {
              setSelectedMethod(value);
              setValue("paymentMethod", value);
            }}
            defaultValue="card"
            className="flex flex-col space-y-4"
          >
            <div
              className={cn(
                "flex items-center space-x-2 border p-4 rounded-md",
                selectedMethod === "card" && "ring-2 ring-purple-500"
              )}
            >
              <RadioGroupItem value="card" id="card" />
              <label htmlFor="card" className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Pay with Card</span>
              </label>
            </div>

            <div
              className={cn(
                "flex items-center space-x-2 border p-4 rounded-md",
                selectedMethod === "wallet" && "ring-2 ring-purple-500"
              )}
            >
              <RadioGroupItem value="wallet" id="wallet" />
              <label htmlFor="wallet" className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Pay with Wallet</span>
              </label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          {selectedPlan ? (
            <Button
              onClick={handlePlanPayment}
              className="w-full bg-purple-600 text-white"
            >
              Pay Now for {selectedPlan.name}
            </Button>
          ) : (
            <Button onClick={() => navigate("/users/dashboard")} className="w-full">
              View My Coverage
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default PaymentMethodForm;
