"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, Edit, MoreVertical, Settings, LogOut } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { useChatStore, Conversation } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewChatDialog } from "@/components/features/new-chat-dialog";

export function Sidebar() {
  const { user, setUser } = useAuthStore();
  const { conversations, setConversations, activeConversationId, setActiveConversationId } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await apiClient.get("/conversations/");
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    if (user) {
      fetchConversations();
    }
  }, [user, setConversations]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.type === "GROUP") return conv.name;
    const otherMember = conv.members.find(m => m.user_id !== user?.id);
    return otherMember?.user?.display_name || "Unknown User";
  };

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 bg-[#F6F6F6] flex flex-col h-full">
      {/* Header & Search */}
      <div className="h-[60px] flex items-center px-4 gap-3 shrink-0">
        <div className="flex items-center gap-2 relative group cursor-pointer shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
              {user?.display_name.charAt(0).toUpperCase()}
            </div>
            {/* Hidden logout button on hover */}
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-black/50 hidden group-hover:flex items-center justify-center" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-[13px] font-semibold text-black truncate max-w-[80px]">
            {user?.display_name}
          </span>
        </div>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
          <Input
            placeholder="Search"
            className="pl-9 bg-[#EBEBEB] border-none rounded-full h-9 text-[13px] focus-visible:ring-0 text-black placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 shrink-0 hover:bg-gray-200" onClick={() => setIsNewChatOpen(true)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => {
          const isUnread = conv.unread_count > 0;
          const isSentByMe = conv.latest_message?.sender_id === user?.id;
          const isActive = activeConversationId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors relative ${isActive ? "bg-[#EAEAEA]" : "hover:bg-[#F0F0F0]"
                }`}
            >
              {isUnread && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3366FF]" />
              )}

              <div className="relative ml-1 shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-medium text-black">
                  {getConversationName(conv)?.charAt(0).toUpperCase()}
                </div>
                {isUnread && (
                  <div className="absolute -top-0.5 -right-0.5 bg-[#3366FF] text-white text-[11px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 border-2 border-[#F6F6F6]">
                    {conv.unread_count}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`truncate text-[15px] text-black ${isUnread ? 'font-bold' : 'font-semibold'}`}>
                    {getConversationName(conv)}
                  </h3>
                  {conv.latest_message && (
                    <span className={`text-[11px] whitespace-nowrap ml-2 ${isUnread ? 'text-black font-semibold' : 'text-gray-500'}`}>
                      {formatDistanceToNow(new Date(conv.latest_message.created_at), { addSuffix: false }).replace('about ', '')}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-[13px] truncate pr-2 ${isUnread ? 'text-black font-medium' : 'text-gray-500'}`}>
                    {conv.latest_message ? conv.latest_message.body : "Start a conversation"}
                  </p>
                  {isSentByMe && (
                    <div className="text-gray-400 shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredConversations.length === 0 && (
          <div className="text-center p-6 text-muted-foreground text-sm">
            No conversations found
          </div>
        )}
      </div>

      {isNewChatOpen && <NewChatDialog onClose={() => setIsNewChatOpen(false)} />}
    </div>
  );
}
