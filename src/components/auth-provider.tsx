"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          if (active) {
            setUser(null);
            setStatus("unauthenticated");
          }
          return;
        }

        const data = await response.json();
        if (active) {
          setUser(data?.user || null);
          setStatus(data?.user ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        if (active) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        setUser: (nextUser) => {
          setUser(nextUser);
          setStatus(nextUser ? "authenticated" : "unauthenticated");
        },
        clearUser: () => {
          setUser(null);
          setStatus("unauthenticated");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
