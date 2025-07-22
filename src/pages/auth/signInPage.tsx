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

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const { updateUser, setTokens, reset } = useUserStore();

  const loginMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      return AuthService.loginUser(values);
    },
    onSuccess: (resp) => {
      updateUser(resp.data.user);
      setTokens(resp.data.token, "");
      toast.success("Woo hoo signed in");
      navigate("/users/dashboard");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage =
        ((err as AxiosError).response?.data as ApiResponse<null>)?.message ||
        "Sign in Error";
      toast.error(errorMessage);
      reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="w-full z-20 max-w-[400px] bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold text-gray-700 text-center mb-6">
        Thrift Management Sign In
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full bg-[#2341AA] text-white py-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4 text-sm text-gray-600">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>{" "}
        </p>
        Forgot your password?{" "}
        <Link to="/reset-password" className="text-blue-600 hover:underline">
          Reset Password
        </Link>
      </div>
    </div>
  );
}
