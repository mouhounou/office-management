import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { App } from "@/App";
import { ApiError } from "@/lib/api";
import { AuthProvider } from "@/lib/auth";
import { applyStoredTheme, useTheme } from "@/lib/theme";
import "@/styles.css";

applyStoredTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      // Inutile d'insister sur une erreur d'autorisation ou une ressource absente.
      retry: (count, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 2,
    },
  },
});

function ThemedToaster() {
  const { dark } = useTheme();
  return <Toaster richColors position="top-right" theme={dark ? "dark" : "light"} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ThemedToaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
