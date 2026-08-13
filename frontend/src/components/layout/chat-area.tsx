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
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
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
              <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
                <div 
                  className={`relative max-w-[70%] px-4 py-2 rounded-[20px] shadow-sm ${
                    isMine 
                      ? "bg-[#3366FF] text-white rounded-br-sm" 
                      : "bg-[#F0F2F5] dark:bg-[#202020] text-foreground rounded-bl-sm"
                  }`}
                >
                  {activeConversation.type === "GROUP" && !isMine && (
                    <p className="text-[11px] font-semibold text-primary mb-0.5">
                      {msg.sender?.display_name || "Unknown User"}
                    </p>
                  )}
                  <p className="text-[15px] leading-relaxed break-words">{msg.body}</p>
                  <div className={`text-[11px] flex items-center gap-1 justify-end mt-0.5 opacity-80 ${isMine ? "text-white/90" : "text-muted-foreground"}`}>
                    {format(new Date(msg.created_at), "HH:mm")}
                    {isMine && (
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
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
      <div className="p-3 bg-background border-t shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground shrink-0">
            <PlusCircle className="w-6 h-6" />
          </Button>
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message" 
            className="flex-1 rounded-3xl bg-[#F0F2F5] dark:bg-[#202020] border-none h-11 px-5 text-[15px] focus-visible:ring-0"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputText.trim()}
            className={`rounded-full h-11 w-11 shrink-0 ${inputText.trim() ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
