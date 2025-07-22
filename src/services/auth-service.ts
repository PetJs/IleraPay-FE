import { publicApi } from "@/lib/axios";
import type { ApiResponse, AuthCredentials, AuthUser, User } from "@/lib/types";
import { AxiosError } from "axios";

export class AuthService {
  static async registerUser(
    user: Omit<User, "id" | "last_login" | "date_created" | "address">
  ): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await publicApi.post("/users/", user);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  static async loginUser(req: AuthCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await publicApi.post("/users/login/", req);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error as AxiosError;
    }
  }

  static async loginAdmin(
    req: AuthCredentials
  ): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await publicApi.post("/admin/login/", req);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error as AxiosError;
    }
  }
}
