import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// MongoDB connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/layer0-auth";
const client = new MongoClient(mongoUri);
const db = client.db("layer0-auth");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "layer0",
  },
  trustedOrigins: [
    "http://localhost:3000", // Frontend URL
    "http://localhost:3001", // Alternative frontend port
  ],
  plugins: [
    organization({
      teams: {
        enabled: true,
        maximumTeams: 50, // Maximum channels per group
        allowRemovingAllTeams: false, // Prevent removing the last channel
      },
      allowUserToCreateOrganization: true,
      organizationCreation: {
        beforeCreate: async ({ organization, user }) => {
          // Add default metadata for groups
          return {
            data: {
              ...organization,
              metadata: {
                ...organization.metadata,
                type: "group", // Mark as a Layer0 group
                visibility: "public", // Default visibility
                memberCount: 1, // Initial member count
              },
            },
          };
        },
        afterCreate: async ({ organization, member }) => {
          // Create default general channel after group creation
          // This will be handled by the client after organization creation
        },
      },
    }),
    nextCookies(), // This should be the last plugin in the array
  ],
});

export const authClient = auth;

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
