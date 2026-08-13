"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatArea } from "@/components/layout/chat-area";
import { apiClient } from "@/api/client";

export default function Home() {
  const { user } = useAuthStore();
  const { activeConversationId, addMessage, updateConversationLatestMessage, setConversations } = useChatStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Connect to global WebSocket
    const isDev = process.env.NODE_ENV === "development";
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const backendHost = isDev ? "localhost:8000" : window.location.host;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${wsProtocol}//${backendHost}/ws/conversations`;

    // Fallback if rewrites fail, but standard is /ws for our new endpoint
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("Global WebSocket Connected!");
    ws.onclose = (e) => console.log("Global WebSocket Closed!", e.code, e.reason);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'NEW_MESSAGE') {
          const message = data.message;

          // Only add to the active view if it belongs to the active conversation
          // The store expects addMessage to add it to the 'messages' array, 
          // which represents the currently active chat's messages.
          // In a perfect world, the store holds messages for ALL chats, but our store 
          // just holds the ACTIVE chat messages. We must check this:
          if (useChatStore.getState().activeConversationId === message.conversation_id) {
            addMessage(message);
          }

          // Always update the conversation list with latest_message
          updateConversationLatestMessage(message.conversation_id, message);
        }

        if (data.type === 'NEW_CONVERSATION') {
          // A new group or direct message was created, refresh sidebar
          apiClient.get("/conversations/").then((res) => {
            setConversations(res.data);
          }).catch(console.error);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [user, addMessage, updateConversationLatestMessage, setConversations]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden w-full bg-background">
      <Sidebar />
      {activeConversationId ? (
        <ChatArea />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-background text-center px-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-foreground mb-3">Signal for Web</h2>
          <p className="text-muted-foreground max-w-md">
            Send and receive messages in real time. Select a contact on the left to start chatting.
          </p>
        </div>
      )}
    </div>
  );
}
