import { authApi, publicApi } from "@/lib/axios";
import axios, { AxiosError } from "axios";
import useUserStore from "@/store/user-store";
import type { ApiResponse, ClaimPayload, PaymentData, PaymentInitResponse, PaymentPayload, User } from "@/lib/types";

export class UserService {
  static async  initializePayment(
  payload: PaymentPayload
): Promise<ApiResponse<PaymentInitResponse>> {
  const res = await axios.post("/api/v1/payments/initialize", payload);
  return res.data;
}

  static async getAllInsurancePlans(): Promise<ApiResponse<any>> {
  try {
    const response = await publicApi.get("/api/v1/insurance-plans");
    return response.data;
  } catch (error) {
    console.error("Error fetching insurance plans:", error);
    throw error;
  }
}

static async subscribeToPlan(payload: { planId: string; payment: PaymentData }): Promise<ApiResponse<null>> {
  try {
    const response = await authApi.post(
      `/api/v1/insurance-subscriptions/subscribe/${payload.planId}`,
      payload.payment
    );
    return response.data;
  } catch (error) {
    console.error(`Error subscribing to plan ${payload.planId}:`, error);
    if (error instanceof AxiosError && error.response) {
      console.error("Status:", error.response.status, "Data:", error.response.data);
    }
    throw error;
  }
}


  static async submitClaim(
    data: ClaimPayload
  ): Promise<ApiResponse<null>> {
    try {
      console.log("=== SUBMIT CLAIM ===", data);
      const response = await authApi.post("/api/v1/claims", data);
      return {
        status_code: 200,
        data: response.data,
        message: "Claim submitted successfully"
      };
    } catch (error) {
      console.error("Error submitting claim:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Status:", error.response.status, "Data:", error.response.data);
      }
      throw error as AxiosError;
    }
  }

  static async sendChatMessage(message: string): Promise<{ response: string }> {
    console.log("=== SEND CHAT MESSAGE ===");
    console.log("Message:", message);
    
    try {
      const { data } = await axios.post("/api/chat/", { message });
      console.log("Chat API response:", data);
      return { response: data.reply };
    } catch (error) {
      console.error("=== CHAT MESSAGE ERROR ===");
      console.error("Error sending chat message:", error);
      
      if (error instanceof AxiosError) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
      }
      
      throw error as AxiosError;
    }
  }

  static async getProfile(): Promise<ApiResponse<{ user: User; wallet: any }>> {
    try {
      const response = await authApi.get('/api/v1/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  

  // ... other methods ...

  static async logout(): Promise<void> {
    console.log("=== LOGGING OUT ===");
    try {
      // Optionally inform backend
      await authApi.post("/api/v1/auth/logout"); // <- if your API supports logout
      console.log("Backend logout successful");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Logout API error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected logout error:", error);
      }
      // Continue with local logout even if backend fails
    }

    // Clear user session in frontend store
    const logoutFn = useUserStore.getState().reset;
    logoutFn();
    console.log("User store cleared");
  }




  static async validateReceipt(data: {
    hospitalName: string;
    patientId: string;
    amount: number;
  }): Promise<{ valid: boolean; reason?: string }> {
    console.log("=== VALIDATE RECEIPT ===");
    console.log("Validation data:", data);
    
    try {
      console.log("Making POST request to /claims/validate");
      const response = await publicApi.post('/claims/validate', data);
      
      console.log("=== VALIDATE RECEIPT SUCCESS ===");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Validation response:", response.data);
      
      // Validate response format
      if (response.status === 201) {
      return { valid: true };
      }
      // Otherwise, try to read a reason:
      const resp = response.data as any;
      return {
        valid: false,
        reason: resp.reason || 'Validation failed',
      };
    } catch (error) {
      console.error("=== VALIDATE RECEIPT ERROR ===");
      console.error("Error validating receipt:", error);
      
      if (error instanceof AxiosError) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        
        // Network error
        if (!error.response) {
          console.error("Network Error - No response received");
          console.error("Possible causes: CORS, network connectivity, server down");
        }
        
        // Specific error handling for validation
        if (error.response?.status === 404) {
          console.error("Validation endpoint not found - Check if /claims/validate exists");
        }
        
        if (error.response?.status === 422) {
          console.error("Validation failed - Invalid data format:", error.response.data);
        }
      }
      // Network or server error → treat as invalid
    return { valid: false, reason: error instanceof AxiosError ? error.message : 'Network or server error'};
    }
  }
}

// Add this helper function to debug axios configuration
export const debugAxiosConfig = () => {
  console.log("=== AXIOS CONFIG DEBUG ===");
  console.log("publicApi baseURL:", publicApi.defaults.baseURL);
  console.log("publicApi timeout:", publicApi.defaults.timeout);
  console.log("publicApi headers:", publicApi.defaults.headers);
  
  // Test if the API base is reachable
  publicApi.get('/')
    .then(response => {
      console.log("Base API is reachable:", response.status);
    })
    .catch(error => {
      console.error("Base API is NOT reachable:", error.message);
    });
};