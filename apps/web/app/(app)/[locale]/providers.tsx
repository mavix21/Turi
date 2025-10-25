"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, cookieToInitialState, WagmiProvider } from "wagmi";

import { wagmiAdapter } from "@/reown";

const queryClient = new QueryClient();

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
