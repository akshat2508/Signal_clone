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
    <div className="w-80 border-r bg-sidebar flex flex-col h-full">
      {/* Header & Search */}
      <div className="h-[60px] flex items-center px-4 gap-3 bg-background border-b border-sidebar-border shrink-0">
        <div className="relative group cursor-pointer shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
            {user?.display_name.charAt(0).toUpperCase()}
          </div>
          {/* Hidden logout button on hover */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-black/50 hidden group-hover:flex items-center justify-center" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input 
            placeholder="Search" 
            className="pl-9 bg-[#F0F2F5] dark:bg-[#202020] border-none rounded-full h-9 text-[13px] focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0" onClick={() => setIsNewChatOpen(true)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <div 
            key={conv.id}
            onClick={() => setActiveConversationId(conv.id)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors relative ${
              activeConversationId === conv.id ? "bg-[#EAEAEA] dark:bg-[#2c2c2c]" : "hover:bg-sidebar-accent"
            }`}
          >
            {activeConversationId === conv.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3366FF]" />
            )}
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center font-medium ml-1">
              {getConversationName(conv)?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-medium truncate text-foreground text-[15px]">
                  {getConversationName(conv)}
                </h3>
                {conv.latest_message && (
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(conv.latest_message.created_at), { addSuffix: false }).replace('about ', '')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-muted-foreground truncate pr-2">
                  {conv.latest_message ? conv.latest_message.body : "Start a conversation"}
                </p>
                {conv.unread_count > 0 && (
                  <div className="bg-[#3366FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {conv.unread_count}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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
