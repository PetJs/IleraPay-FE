import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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
  companyToBePaid: z.string().min(1, "Company name is required"),
  receipt: z.any().refine((file) => file instanceof File, {
    message: "Receipt is required",
  }),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

export default function ClaimPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      description: "",
      yourName: "",
      companyToBePaid: "",
      receipt: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: UserService.submitClaim,
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Claim submitted successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleFileChange = (file: File | null) => {
    if (file) form.setValue("receipt", file);
  };

  const onSubmit = (values: ClaimFormValues) => {
    mutation.mutate(values);
  };

  const handleNewClaim = () => {
    form.reset();
    setIsSubmitted(false);
  };
  

  if (isSubmitted) {
    return (
      <div className="min-h-screen b max-w-md mx-auto flex items-center justify-center p-4">
        <Card className="w-full border-none bg-white">
          <CardContent className="p-6 text-center relative">
            <CircleX className="absolute right-4 top-0 text-purple-500" onClick={handleNewClaim}/>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Claim Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your claim has been submitted successfully. You'll receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <Button onClick={handleNewClaim} className="w-full bg-purple-500">
                Submit Another Claim
              </Button>
              {/* <Button variant="outline" className="w-full bg-purple-500 border-none">
                View Claim Status
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pt-12 pb-14">
      <ScrollArea className="flex-1 ">
        <div className="p-4 ">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Claim Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please fill in all required fields to submit your claim.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your claim in detail..." {...field} className="resize-none min-h-[100px]" />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yourName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyToBePaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company to be Paid</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

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
                            accept="image/*,.pdf"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-purple-500" disabled={mutation.isPending} >
                    {mutation.isPending ? "Submitting..." : "Submit Claim"}
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
