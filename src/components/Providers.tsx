"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { LocaleProvider } from "@/src/lib/i18n";
import { ServiceWorkerRegistry } from "./ServiceWorkerRegistry";
import { InstallPrompt } from "./InstallPrompt";

const ONE_MINUTE = 60_000;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * ONE_MINUTE,
            gcTime: 30 * ONE_MINUTE,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        {children}
        <ServiceWorkerRegistry />
        <InstallPrompt />
      </LocaleProvider>
    </QueryClientProvider>
  );
}
