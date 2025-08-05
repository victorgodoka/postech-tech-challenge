import type { AppProps } from 'next/app';
import { ReduxProvider } from "@/store/provider";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "@/components/Toast";
import { ConfirmationProvider } from "@/components/ConfirmationModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NoSSR } from "@/components/NoSSR";
import 'react-toastify/dist/ReactToastify.css';

// Import global styles
import './globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <NoSSR>
          <ToastProvider>
            <ConfirmationProvider>
              <Component {...pageProps} />
              <ToastContainer />
            </ConfirmationProvider>
          </ToastProvider>
        </NoSSR>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
