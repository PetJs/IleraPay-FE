import { publicApi } from "@/lib/axios";
import type { ApiResponse, AuthCredentials, LoginResponse } from "@/lib/types";
import { AxiosError } from "axios";

export class AuthService {
  static async registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await publicApi.post("/api/v1/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  static async loginUser(req: AuthCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await publicApi.post("/api/v1/auth/login", {
        email: req.email,
        password: req.password,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error as AxiosError;
    }
  }

  static async loginAdmin(req: AuthCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await publicApi.post("/api/v1/auth/admin/login", {
        email: req.email,
        password: req.password,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in as admin:", error);
      throw error as AxiosError;
    }
  }
}
