import { publicApi } from "@/lib/axios";
import type { ApiResponse, AuthCredentials, AuthUser } from "@/lib/types";
import { AxiosError } from "axios";

export class AuthService {
  /** Register a new user */
  static async registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await publicApi.post("/api/v1/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  /** Log in an existing user */
  static async loginUser(req: AuthCredentials): Promise<ApiResponse<AuthUser>> {
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

  /** (Optional) Admin login, if your API supports it */
  static async loginAdmin(req: AuthCredentials): Promise<ApiResponse<AuthUser>> {
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
