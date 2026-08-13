"use client";

import { useState, useEffect } from "react";
import { X, Search, Users, UserPlus } from "lucide-react";
import { apiClient } from "@/api/client";
import { useChatStore } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewChatDialog({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"direct" | "group">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { setConversations, setActiveConversationId, conversations } = useChatStore();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setUsers([]);
        return;
      }
      try {
        const { data } = await apiClient.get(`/users/search?q=${searchQuery}`);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleStartDirect = async (userId: string) => {
    try {
      const { data } = await apiClient.post("/conversations/direct", {
        contact_user_id: userId
      });
      // Refresh conversations list to include the new one
      const listRes = await apiClient.get("/conversations/");
      setConversations(listRes.data);
      setActiveConversationId(data.id);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    try {
      const { data } = await apiClient.post("/conversations/group", {
        name: groupName,
        member_ids: selectedUsers
      });
      // Refresh list
      const listRes = await apiClient.get("/conversations/");
      setConversations(listRes.data);
      setActiveConversationId(data.id);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-md rounded-xl shadow-xl flex flex-col overflow-hidden max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center bg-sidebar">
          <h2 className="font-semibold text-lg">New Chat</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'direct' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab("direct")}
          >
            Direct Message
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'group' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab("group")}
          >
            New Group
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === "group" && (
            <div className="mb-4">
              <Input 
                placeholder="Group Name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="mb-4 bg-[#F0F0F0] border-none rounded-lg h-12 text-black"
              />
            </div>
          )}

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search users by username or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#F0F0F0] border-none rounded-lg h-11 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            {users.map(user => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-3 hover:bg-[#F0F0F0] rounded-lg cursor-pointer transition-colors"
                onClick={() => activeTab === 'direct' ? handleStartDirect(user.id) : toggleUserSelection(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.display_name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                {activeTab === 'group' && (
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedUsers.includes(user.id) ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                    {selectedUsers.includes(user.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                )}
              </div>
            ))}
            {searchQuery && users.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">No users found</p>
            )}
            {!searchQuery && (
              <p className="text-center text-sm text-muted-foreground py-4">Type to search for people to chat with</p>
            )}
          </div>
        </div>
        
        {activeTab === "group" && (
          <div className="p-4 border-t bg-[#F6F6F6]">
            <Button 
              className="w-full h-11 rounded-full" 
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedUsers.length === 0}
            >
              Create Group ({selectedUsers.length} members)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
