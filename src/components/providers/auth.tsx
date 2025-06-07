"use client";

// filepath: c:\Code\layer0\frontend\src\components\providers\auth.tsx
import { useSession } from "@/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
}

interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (sessionData) {
      setUser(sessionData.user);
      setSession(sessionData.session);
    } else {
      setUser(null);
      setSession(null);
      setHasSynced(false);
    }
  }, [sessionData]);

  // Sync user data to Convex when user signs in
  useEffect(() => {
    if (user && !hasSynced) {
      const syncUser = async () => {
        try {
          const response = await fetch("/api/users/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            setHasSynced(true);
            console.log("User synced to Convex successfully");
          } else {
            console.error("Failed to sync user to Convex");
          }
        } catch (error) {
          console.error("Error syncing user to Convex:", error);
        }
      };

      syncUser();
    }
  }, [user, hasSynced]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading: isPending,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
