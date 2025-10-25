import type { SIWESession } from "@reown/appkit-siwe";
import { cache } from "react";
import {
  getAddressFromMessage /* verifySignature, */,
  getChainIdFromMessage,
} from "@reown/appkit-siwe";
import { fetchMutation } from "convex/nextjs";
import { importPKCS8, SignJWT } from "jose";
import { AuthOptions, DefaultUser, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createPublicClient, http } from "viem";

import type { Id } from "@turi/convex/_generated/dataModel";
import { api } from "@turi/convex/_generated/api";

import { env } from "./src/env";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: `0x${string}`;
    chainId: number;
    userId: Id<"users">;
    convexToken: string;
  }

  interface User extends DefaultUser {
    userId: Id<"users">;
  }

  interface JWT {
    userId: Id<"users">;
  }
}

const nextAuthSecret = env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(/.cloud$/, ".site");

const providers = [
  CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error("SiweMessage is undefined");
        }
        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
        /*  const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        }); */
        // we are going to use https://viem.sh/docs/actions/public/verifyMessage.html
        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`,
          ),
        });
        const isValid = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });
        // end o view verifyMessage
        if (!isValid) {
          console.error("Invalid SIWE signature");
          return null;
        }

        const userId = await fetchMutation(api.users.createUser, {
          address,
        });

        return {
          id: `${chainId}:${address}`,
          userId,
        };
      } catch (e) {
        return null;
      }
    },
  }),
];

export const authOptions: AuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  secret: nextAuthSecret,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) {
        return session;
      }

      const [, chainId, address] = token.sub.split(":");
      if (chainId && address) {
        session.address = address as `0x${string}`;
        session.chainId = parseInt(chainId, 10);
      }
      if (token.userId) {
        session.userId = token.userId as Id<"users">;
      }

      const privateKey = await importPKCS8(
        env.CONVEX_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n"),
        "RS256",
      );
      const convexToken = await new SignJWT({
        sub: session.userId,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);

      session.convexToken = convexToken;

      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.userId;
      }

      return token;
    },
  },
};

export const auth = cache(async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
});
