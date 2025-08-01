import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { scanReceipt } from "@/lib/receiptScanner";
import { UserService } from "@/services/user-service";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/FileUpload";
import { CheckCircle, CircleX } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const claimSchema = z.object({
  description: z.string().min(1, "Description is required"),
  yourName: z.string().min(1, "Name is required"),
  hospitalToBePaid: z.string().min(1, "Hospital name is required"),
  receipt: z
    .any()
    .refine((file) => file instanceof File, { message: "Receipt is required" }),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

export default function ClaimPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      description: "",
      yourName: "",
      hospitalToBePaid: "",
      receipt: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: UserService.submitClaim,
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Claim submitted successfully!");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to submit claim. Please try again.");
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    form.setValue("receipt", file);

    try {
      const { hospitalName, patientId, amount } = await scanReceipt(file);

      if (hospitalName) {
        form.setValue("hospitalToBePaid", hospitalName);
      }

      if (patientId) {
        form.setValue("yourName", patientId); // assuming patient ID is used as name — adjust if needed
      }

      if (amount !== null) {
        form.setValue(
          "description",
          `Amount billed: ${amount.toLocaleString()}`
        );
      }

      toast.success("Receipt scanned. Please review and submit.");
    } catch (error) {
      console.error("Error running OCR:", error);
      toast.error("Failed to scan receipt. Please try a clearer image.");
    }
  };

  const onSubmit = async (values: ClaimFormValues) => {
    setIsProcessing(true);
    console.log("=== FORM SUBMISSION START ===", values);

    try {
      // 1️⃣ OCR + Extract
      const file = values.receipt as File;
      console.log("Starting OCR for file:", file.name);
      const { hospitalName, patientId, amount } = await scanReceipt(file);
      console.log("OCR completed:", { hospitalName, patientId, amount });

      if (!hospitalName || !patientId || amount == null) {
        toast.error("Could not parse receipt. Please upload a clearer copy.");
        return;
      }

      // 2️⃣ Backend validation
      console.log("Calling validateReceipt with:", {
        hospitalName,
        patientId,
        amount,
      });
      const { valid, reason } = await UserService.validateReceipt({
        hospitalName,
        patientId,
        amount,
      });

      if (!valid) {
        toast.error(`Receipt validation failed: ${reason || "Unknown error"}`);
        return;
      }
      toast.success("Receipt validated! Submitting your claim…");

      // 3️⃣ Submit claim
      console.log("Calling mutation.mutate with:", values);
      mutation.mutate(values);
    } catch (err) {
      console.error("Error in onSubmit:", err);
      toast.error("An error occurred during processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewClaim = () => {
    form.reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center p-4">
        <Card className="w-full bg-white">
          <CardContent className="p-6 text-center relative">
            <CircleX
              className="absolute right-4 top-0 text-purple-500 cursor-pointer"
              onClick={handleNewClaim}
            />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Claim Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your claim has been submitted successfully. You’ll receive a
              confirmation email shortly.
            </p>
            <Button onClick={handleNewClaim} className="w-full bg-purple-500">
              Submit Another Claim
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pt-12 pb-14">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Claim Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please fill in all required fields to submit your claim.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your claim..."
                            className="resize-none min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Your Name */}
                  <FormField
                    control={form.control}
                    name="yourName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Hospital to be Paid */}
                  <FormField
                    control={form.control}
                    name="hospitalToBePaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital to be Paid</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter hospital name" />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Receipt Upload */}
                  <FormField
                    control={form.control}
                    name="receipt"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Receipt</FormLabel>
                        <FormControl>
                          <FileUpload
                            label="Choose receipt file"
                            onFileChange={handleFileChange}
                            accept="image/*"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-500"
                    disabled={isProcessing || mutation.isPending}
                  >
                    {isProcessing || mutation.isPending
                      ? "Processing..."
                      : "Submit Claim"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
