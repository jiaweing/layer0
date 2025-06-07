"use client";

import { organizationClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? undefined // Use same domain in production
      : "http://localhost:3000", // Frontend URL for development
  credentials: "include",
  plugins: [
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
    polarClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
