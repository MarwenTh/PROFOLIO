"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

/**
 * This component handles syncing the NextAuth session with the backend HttpOnly cookies.
 * It's particularly useful for social logins (Google/GitHub) where the final redirect 
 * might not have set the backend's secure cookies yet.
 */
export function AuthSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncAuth = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          // Check if we already have a valid session on the backend
          // The interceptor will handle token refresh if needed
          await api.get("/auth/me");
        } catch (error: any) {
          // If 401, the interceptor would have tried to refresh.
          // If we reach here, it means we definitely need a new session or sync.
          if (error.response?.status === 401) {
            console.log("AuthSync: Syncing social session with backend...");
            try {
              await api.post("/auth/social-sync", {
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
              });
              console.log("AuthSync: Sync successful.");
            } catch (syncError) {
              console.error("AuthSync: Sync failed:", syncError);
            }
          }
        }
      }
    };

    syncAuth();
  }, [session, status]);

  return null;
}
