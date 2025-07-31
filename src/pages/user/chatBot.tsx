import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/user-service";
import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

const useChatMutation = () =>
  useMutation({
    mutationFn: UserService.sendChatMessage,
  });

const ChatBotPage = () => {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([{ type: "bot", text: "Hello! Ask me anything. Type / to see list of commands" }]);
  const [input, setInput] = useState("");
  const chatMutation = useChatMutation();

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: { type: "user" | "bot"; text: string } = {
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    chatMutation.mutate(input, {
      onSuccess: (data) => {
        const botMessage: { type: "user" | "bot"; text: string } = {
          type: "bot",
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      },
      onError: (err) => {
        console.error("Chat error:", err);
      },
    });

    setInput("");
  };

  return (
    <div className=" relative h-screen w-full p-2 pt-14">
      <div className="overflow-y-auto">
        {messages.map((msg, i) => {
          const isUser = msg.type === "user";
          return (
            <div
              key={i}
              className={`flex items-center mb-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <Bot className="w-6 h-6 text-black mr-2 mt-1 shrink-0" />
              )}

              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  isUser
                    ? "bg-purple-500 text-white"
                    : "bg-[#F0F0F0] text-black"
                }`}
              >
                {msg.text}
              </div>

              {isUser && (
                <User className="w-6 h-6 text-purple-500 ml-2 mt-1 shrink-0" />
              )}
            </div>
          );
        })}

        {chatMutation.isPending && (
          <div className="bg-gray-200 text-gray-600 p-3 rounded-lg max-w-xs">
            Thinking...
          </div>
        )}
      </div>

      <div className="absolute bottom-16 flex w-[96vw] justify-between flex gap-4">
        <input
          className=" p-2 w-[72vw] bg-gray-500 rounded-3xl text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-200 text-purple-500 rounded-full w-12 h-12 flex items-center justify-center"
          disabled={chatMutation.isPending}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatBotPage;
