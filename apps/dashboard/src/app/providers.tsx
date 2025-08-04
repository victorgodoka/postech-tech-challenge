"use client";

import { ReduxProvider } from "@/store/provider";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "@/components/Toast";
import { ConfirmationProvider } from "@/components/ConfirmationModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NoSSR } from "@/components/NoSSR";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <NoSSR>
          <ToastProvider>
            <ConfirmationProvider>
              {children}
              <ToastContainer />
            </ConfirmationProvider>
          </ToastProvider>
        </NoSSR>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
