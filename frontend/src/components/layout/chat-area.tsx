"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Send, Search, Video, MoreVertical, PlusCircle } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { useChatStore, Conversation, Message } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatArea() {
  const { user } = useAuthStore();
  const { activeConversationId, conversations, messages, setMessages, addMessage, updateConversationLatestMessage } = useChatStore();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Fetch messages
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await apiClient.get(`/conversations/${activeConversationId}/messages`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [activeConversationId, setMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    const body = inputText;
    setInputText("");

    try {
      const { data } = await apiClient.post(`/conversations/${activeConversationId}/messages`, {
        body,
        message_type: "TEXT"
      });
      addMessage(data);
      updateConversationLatestMessage(activeConversationId, data);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.type === "GROUP") return conv.name;
    const otherMember = conv.members.find(m => m.user_id !== user?.id);
    return otherMember?.user?.display_name || "Unknown User";
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-1">Signal Clone</h2>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-background shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-medium overflow-hidden">
            {activeConversation.avatar_url ? (
              <img src={activeConversation.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              getConversationName(activeConversation)?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="font-medium text-foreground">{getConversationName(activeConversation)}</h2>
            <p className="text-xs text-muted-foreground">
              {/* Could add typing indicator here or online status */}
              Click here for contact info
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <Video className="w-[22px] h-[22px]" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <Search className="w-[20px] h-[20px]" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-24 bg-background">
        <div className="max-w-4xl mx-auto space-y-3 pb-4">
          {messages.map((msg, index) => {
            const isMine = msg.sender_id === user?.id;
            const showDate = index === 0 || new Date(msg.created_at).getDate() !== new Date(messages[index - 1].created_at).getDate();

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/80 dark:bg-gray-800/80 backdrop-blur text-xs font-medium px-3 py-1 rounded-full text-muted-foreground shadow-sm">
                      {format(new Date(msg.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMine ? "justify-end" : "justify-start items-end gap-2"} mb-2`}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-sm font-medium text-black">
                      {(msg.sender?.display_name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`relative max-w-[70%] px-[14px] py-[10px] shadow-sm ${isMine
                        ? "bg-[#3366FF] text-white rounded-[20px] rounded-br-sm"
                        : "bg-[#EAEAEA] text-black rounded-[20px] rounded-bl-sm"
                      }`}
                  >
                    {activeConversation.type === "GROUP" && !isMine && (
                      <p className="text-[13px] font-bold text-black mb-0.5">
                        {msg.sender?.display_name || "Unknown User"}
                      </p>
                    )}
                    <p className="text-[15px] leading-[1.4] break-words">{msg.body}</p>
                    <div className={`text-[11px] flex items-center gap-1 mt-1 font-medium ${isMine ? "text-white/90 justify-end" : "text-gray-500 justify-start"}`}>
                      {format(new Date(msg.created_at), "HH:mm")}
                      {isMine && (
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-0.5" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Composer */}
      <div className="p-3 px-4 bg-white shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" className="text-gray-500 shrink-0 hover:bg-gray-100 rounded-full h-9 w-9">
            <PlusCircle className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message"
              className="w-full rounded-full bg-[#F0F0F0] border-none h-10 pl-5 pr-12 text-[15px] focus-visible:ring-0 text-black placeholder:text-gray-500"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim()}
            className={`rounded-full h-10 w-10 shrink-0 transition-colors ${inputText.trim() ? 'bg-primary hover:bg-blue-600' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send className="w-[18px] h-[18px] ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
