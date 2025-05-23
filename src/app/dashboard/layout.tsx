"use client";

import { useAuth } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <p>Carregando sessão...</p>;
  if (!isAuthenticated) return null;

  return <main className="min-h-screen flex flex-col">{children}</main>;
}
