import { ConvexHttpClient } from "convex/browser";
import "dotenv/config";

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  throw new Error("CONVEX_URL environment variable is not set");
}

const convex = new ConvexHttpClient(convexUrl);

export { convex };
