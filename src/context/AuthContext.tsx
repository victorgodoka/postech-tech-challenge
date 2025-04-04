"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Session,
  getSession,
  createSession,
  clearSession as destroySession,
} from "@/utils";
import { loginUser } from "@/lib/api";
import { setSessionCookie, removeSessionCookie } from "@/utils";

type AuthContextType = {
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (currentSession) setSession(currentSession);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginUser(email, password);
    const newSession = createSession(user.email);

    setSessionCookie(newSession);

    setSession(newSession);
  };

  const logout = () => {
    destroySession();
    removeSessionCookie();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext precisa estar dentro de <AuthProvider>");
  return context;
};
