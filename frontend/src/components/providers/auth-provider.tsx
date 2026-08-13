"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/api/client";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isLoading, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setUser, setLoading]);

  // Protected route logic
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/verify");
      if (!user && !isAuthRoute) {
        router.push("/login");
      } else if (user && isAuthRoute) {
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
