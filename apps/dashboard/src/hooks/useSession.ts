import { useEffect, useState } from "react";
import { getSession, Session } from "@/utils";
import { useAuth as useReduxAuth } from "@/hooks/redux/useAuth";
import { useRouter } from "next/router";

export function useSession(redirectTo = "/") {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace(redirectTo);
    } else {
      setSession(session);
    }
    setLoading(false);
  }, [router, redirectTo]);

  return { session, loading };
}

export const useAuth = () => {
  const { session, isAuthenticated, login, logout, loading } = useReduxAuth();
  return { session, isAuthenticated, login, logout, loading };
};

