import { publicApi } from "@/lib/axios";
import useUserStore from "@/store/user-store";
import { AxiosError } from "axios";

export class UserService {

  static async sendChatMessage(message: string): Promise<{ response: string }> {
    console.log("=== SEND CHAT MESSAGE ===");
    console.log("Message:", message);
    
    try {
      const { data } = await publicApi.post("/chat/", { message });
      console.log("Chat API response:", data);
      return data;
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

  static async submitClaim(data: {
    description: string;
    yourName: string;
    hospitalToBePaid: string;
    receipt: File;
  }): Promise<{ message: string }> {
    console.log("=== SUBMIT CLAIM ===");
    console.log("Claim data:", {
      description: data.description,
      yourName: data.yourName,
      hospitalToBePaid: data.hospitalToBePaid,
      receipt: {
        name: data.receipt.name,
        size: data.receipt.size,
        type: data.receipt.type
      }
    });
    
    try {
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("yourName", data.yourName);
      formData.append("hospitalToBePaid", data.hospitalToBePaid);
      formData.append("receipt", data.receipt);

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log("Making POST request to /claims/");
      const response = await publicApi.post("/claims/", formData);
      
      console.log("=== SUBMIT CLAIM SUCCESS ===");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("API response:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("=== SUBMIT CLAIM ERROR ===");
      console.error("Error submitting claim:", error);
      
      if (error instanceof AxiosError) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            timeout: error.config?.timeout
          },
          request: error.request ? "Request was made" : "No request made"
        });
        
        // Network error
        if (!error.response) {
          console.error("Network Error - No response received");
          console.error("Possible causes: CORS, network connectivity, server down");
        }
        
        // HTTP error codes
        if (error.response?.status) {
          switch (error.response.status) {
            case 400:
              console.error("Bad Request - Check form data format");
              break;
            case 401:
              console.error("Unauthorized - Check authentication");
              break;
            case 403:
              console.error("Forbidden - Check permissions");
              break;
            case 404:
              console.error("Not Found - Check API endpoint URL");
              break;
            case 413:
              console.error("Payload Too Large - File might be too big");
              break;
            case 500:
              console.error("Internal Server Error - Backend issue");
              break;
            default:
              console.error(`HTTP ${error.response.status} - Unexpected error`);
          }
        }
      }
      
      throw error as AxiosError;
    }
  }


  // ... other methods ...

  static async logout(): Promise<void> {
    console.log("=== LOGGING OUT ===");
    try {
      // Optionally inform backend
      await publicApi.post("/logout"); // <- if your API supports logout
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