// src/pages/ClaimPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { scanReceipt } from "@/lib/receiptScanner";
import { UserService } from "@/services/user-service";
import type { ApiResponse, ClaimPayload } from "@/lib/types";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";
import { useState } from "react";

const claimSchema = z.object({
  type: z.enum(["medical", "dental", "vision"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  receipt: z
    .any()
    .refine((file) => file instanceof File, "Receipt is required"),
});
type ClaimFormValues = z.infer<typeof claimSchema>;

export default function ClaimPage() {
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      type: "medical",
      title: "",
      description: "",
      receipt: undefined,
    },
  });

  const { mutate, isPending } = useMutation<ApiResponse<null>, Error, ClaimPayload>({
    mutationFn: (payload) => UserService.submitClaim(payload),
    onSuccess: () => {
      toast.success("Claim submitted!");
      setSubmitted(true);
    },
    onError: () => void toast.error("Submit failed"),
  });

  const uploadReceipt = (file: File): Promise<string> =>
    Promise.resolve(URL.createObjectURL(file));

  const onSubmit = async (vals: ClaimFormValues) => {
    setProcessing(true);
    try {
      const { amount, hospitalName, patientId } = await scanReceipt(vals.receipt as File);

      if (amount == null) {
        toast.error("Couldn’t parse amount from receipt");
        return;
      }

      const receiptUrl = await uploadReceipt(vals.receipt as File);

      const title = hospitalName
        ? `${hospitalName} Claim`
        : vals.title || "Health Claim";

      const description = patientId
        ? `Claim for patient ID ${patientId}`
        : vals.description || "Automatically generated claim.";

      const payload: ClaimPayload = {
        type: vals.type,
        title,
        description,
        amount,
        receiptUrl,
        documents: [],
      };

      mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleNew = () => {
    form.reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl mb-4">✅ Your claim is in!</h2>
        <Button onClick={handleNew}>Submit Another</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="vision">Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Claim title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe your claim" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receipt"
            render={() => (
              <FormItem>
                <FormLabel>Receipt</FormLabel>
                <FormControl>
                  <FileUpload
                    label="Upload receipt"
                    accept="image/*"
                    onFileChange={(f) => form.setValue("receipt", f)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={processing || isPending}
          >
            {processing || isPending ? "Submitting…" : "Submit Claim"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
