import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  display_name: string;
  phone_number?: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen_at?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start as true while checking session
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
