import { publicApi } from "@/lib/axios";
import { AxiosError } from "axios";

export class UserService{

   static async sendChatMessage(message: string): Promise<{ response: string }> {
    try {
      const { data } = await publicApi.post("/chat/", { message });
      return data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error as AxiosError;
    }
  }

  static async submitClaim(data: {
    description: string;
    yourName: string;
    companyToBePaid: string;
    receipt: File;
  }): Promise<{ message: string }> {
    try {
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("yourName", data.yourName);
      formData.append("companyToBePaid", data.companyToBePaid);
      formData.append("receipt", data.receipt);

      const response = await publicApi.post("/claims/", formData);
        console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error submitting claim:", error);
      throw error as AxiosError;
    }
  }
}