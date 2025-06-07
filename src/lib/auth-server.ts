import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { MongoClient } from "mongodb";

// MongoDB connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/layer0-auth";
const client = new MongoClient(mongoUri);
const db = client.db("layer0-auth");

// Polar SDK client
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
});

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
  ],  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          // Product configuration for group creation
          products: [
            {
              productId: process.env.POLAR_GROUP_PRODUCT_ID || "", // Product ID for $20 group creation
              slug: "group-creation"
            }
          ],
          successUrl: "/checkout-success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true
        }),        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET || "",
          onOrderPaid: async (payload) => {
            // Handle successful payment and create group
            console.log("Order paid webhook received:", payload);
            
            // Check if this is a group creation payment
            const metadata = payload.data?.metadata || {};
            if (metadata.action === "create-group") {
              const groupName = metadata.groupName as string;
              const groupSlug = metadata.groupSlug as string;
              
              if (groupName && groupSlug) {
                try {
                  console.log("Group creation payment successful:", {
                    groupName,
                    groupSlug,
                    payload: payload.data
                  });
                  
                  // TODO: Implement automatic group creation after payment
                  // This would require mapping the Polar customer to a Better Auth user
                } catch (error) {
                  console.error("Error processing group creation after payment:", error);
                }
              }
            }
          }
        })
      ]
    }),
    organization({
      teams: {
        enabled: true,
        maximumTeams: 50, // Maximum channels per group
        allowRemovingAllTeams: false, // Prevent removing the last channel
      },
      allowUserToCreateOrganization: true,
      organizationCreation: {
        beforeCreate: async ({ organization }) => {
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
        afterCreate: async ({ organization }) => {
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
