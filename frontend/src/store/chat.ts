import { create } from 'zustand';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: {
    id: string;
    username: string;
    display_name: string;
  };
  body: string;
  message_type: string;
  created_at: string;
}

export interface ConversationMember {
  id: string;
  user_id: string;
  role: string;
  user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  }
}

export interface Conversation {
  id: string;
  type: string;
  name?: string;
  avatar_url?: string;
  unread_count: number;
  latest_message?: Message;
  members: ConversationMember[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateConversationLatestMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => {
    // Avoid duplicate messages
    if (state.messages.some(m => m.id === message.id)) {
      return state;
    }
    return { messages: [...state.messages, message] };
  }),
  updateConversationLatestMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, latest_message: message }
        : conv
    )
  }))
}));
