// hoc/withAuth.tsx
import { useAuth } from "@/hooks/redux/useAuth";
import { ComponentType, JSX } from "react";

export function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { session, loading, isAuthenticated } = useAuth();

    if (loading) return <p>Carregando sessão...</p>;
    if (!isAuthenticated || !session) return null;

    return <WrappedComponent {...props} />;
  };
}
