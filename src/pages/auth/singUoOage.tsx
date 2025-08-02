import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth-service";
import useUserStore from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiResponse } from "@/lib/types";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstname: z.string(),
  lastname: z.string(),
  phone: z
    .string()
    .min(9, "Phone must be 9 characters")
    .max(13, "Phone can't be more than 13"),
  address: z.string(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export default function SignUpPage() {
  const navigate = useNavigate();
  const { setUser, setTokens } = useUserStore();

  const registerMutation = useMutation({
    mutationFn: AuthService.registerUser,
    onSuccess: (resp) => {
      setUser({ user: resp.data.user });
      
      setTokens(resp.data.token, "");
      toast.success("Woo hoo signed up");
      navigate("/");
    },
    onError: (err) => {
      console.log(err);
      const errorMessage =
        ((err as AxiosError).response?.data as ApiResponse<null>)?.message ||
        "Sign Up Error";
      toast.error(errorMessage);
    },
  });

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      address: "",
      dateOfBirth: "",
      phone: "",
    },
  });

  const onSubmit = async (values: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    address: string;
    dateOfBirth: string;
    phone: string;
  }) => {
    registerMutation.mutate({
      email: values.email,
      password: values.password,
      firstName: values.firstname,
      lastName: values.lastname,
      phoneNumber: values.phone,
    });
  };

  return (
    <div className="w-full overflow-y-auto p-4 bg-white rounded-t-2xl shadow-md">
      <h1 className="text-xl font-bold text-gray-700 text-center mb-6">
        NaSure Sign Up
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your Phone..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-purple-500 text-white py-6 text-lg rounded-lg"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/" className="text-blue-500 underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
