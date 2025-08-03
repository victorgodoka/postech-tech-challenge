// hoc/withAuth.tsx
import { useSession } from "@/hooks/useSession";
import { ComponentType, JSX } from "react";

export function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { session, loading } = useSession();

    if (loading) return <p>Carregando sessão...</p>;
    if (!session) return null;

    return <WrappedComponent {...props} />;
  };
}
