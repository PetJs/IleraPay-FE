"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useUserStore from "@/store/user-store";
import { cn } from "@/lib/utils";
import { CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PaymentData } from "@/lib/types";

// 👉 import mock plans
import { mockPlans } from "@/mock/mock";

type Props = {
  onPaymentDataChange: React.Dispatch<React.SetStateAction<PaymentData>>;
  isValid: boolean;
};

const PaymentMethodForm: React.FC<Props> = ({
  onPaymentDataChange,
  isValid,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank">("card");
  const { user } = useUserStore(); // still using real user
  const navigate = useNavigate();

  // 👉 use first mock plan (or choose any logic)
  const selectedPlan = mockPlans[0];

  const { register, handleSubmit, setValue } = useForm({
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

    // ✅ Mock handling of payment
    toast.success(`Simulating payment for plan: ${selectedPlan.name}`);
    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/users/dashboard");
    }, 1500);
  };

  useEffect(() => {
    register("paymentMethod", { required: true });
  }, [register]);

  useEffect(() => {
    onPaymentDataChange({
      method: selectedMethod,
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      rememberCard: false,
      bankTransferCompleted: false,
    });
  }, [selectedMethod, onPaymentDataChange]);

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-lg font-semibold">Select Payment Method</h2>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value: "card" | "bank") => {
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
                selectedMethod === "bank" && "ring-2 ring-purple-500"
              )}
            >
              <RadioGroupItem value="bank" id="bank" />
              <label htmlFor="bank" className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Pay with Wallet</span>
              </label>
            </div>
          </RadioGroup>

          {selectedMethod === "card" && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  onPaymentDataChange((prev) => ({
                    ...prev,
                    cardholderName: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  onPaymentDataChange((prev) => ({
                    ...prev,
                    cardNumber: e.target.value,
                  }))
                }
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 p-2 border rounded-md"
                  onChange={(e) =>
                    onPaymentDataChange((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-2 border rounded-md"
                  onChange={(e) =>
                    onPaymentDataChange((prev) => ({
                      ...prev,
                      cvv: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {selectedMethod === "bank" && (
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    onPaymentDataChange((prev) => ({
                      ...prev,
                      bankTransferCompleted: e.target.checked,
                    }))
                  }
                />
                <span>I have completed the bank transfer</span>
              </label>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {selectedPlan ? (
            <Button
              onClick={handlePlanPayment}
              disabled={!isValid}
              className="w-full bg-purple-600 text-white"
            >
              Pay Now for {selectedPlan.name}
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/users/dashboard")}
              className="w-full"
            >
              View My Coverage
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default PaymentMethodForm;
