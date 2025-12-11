"use client";

import type {
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { scroll, scrollSepolia } from "@reown/appkit/networks";
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo,
} from "@reown/appkit/react";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { getAddress, http } from "viem";
import { cookieStorage, createStorage } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

import { env } from "@/src/env";

const projectId = env.NEXT_PUBLIC_PROJECT_ID;

export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
  scroll,
  scrollSepolia,
];

const normalizeAddress = (value: string) => {
  if (!value) {
    return value;
  }

  if (value.startsWith("did:pkh:")) {
    const parts = value.split(":");
    const account = parts[parts.length - 1];

    if (!account?.startsWith("0x")) {
      console.warn("Unexpected CAIP-10 account id", value);
      return value;
    }

    parts[parts.length - 1] = getAddress(account);
    return parts.join(":");
  }

  return getAddress(value);
};

export const extractEvmAddress = (value: string) => {
  if (!value) {
    return value;
  }

  if (value.startsWith("did:pkh:")) {
    const parts = value.split(":");
    return parts[parts.length - 1] ?? value;
  }

  return value;
};

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: chains.map((chain: AppKitNetwork) => parseInt(chain.id.toString())),
    statement: "Please sign with your wallet to continue",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, normalizeAddress(address)),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Failed to get nonce!");

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) return null;

    if (
      typeof session.address !== "string" ||
      typeof session.chainId !== "number"
    )
      return null;

    return {
      address: session.address,
      chainId: session.chainId,
    } satisfies SIWESession;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/",
      });

      return Boolean(success?.ok);
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const metadata = {
  name: "Turi",
  description:
    "Creamos una experiencia de viaje gamificada que transforma cada visita en un logro verificable",
  url: "https://skill-based-web.vercel.app", // TODO
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: true,
  chains: [scroll, scrollSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "smartWalletOnly",
      version: "4",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
});

// Create modal
const modal = createAppKit({
  defaultNetwork: scroll,
  coinbasePreference: "smartWalletOnly",
  adapters: [wagmiAdapter],
  networks: chains,
  projectId,
  siweConfig,
  metadata,
  features: {
    email: false, // default to true
    socials: [
      "google",
      "x",
      "github",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    emailShowWallets: true, // default to true
  },
  allWallets: "HIDE",
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
  ],
});

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect,
};
