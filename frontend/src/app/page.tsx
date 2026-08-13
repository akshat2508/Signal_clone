"use client";

import { useAuthStore } from "@/store/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatArea } from "@/components/layout/chat-area";

export default function Home() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden w-full bg-background">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
