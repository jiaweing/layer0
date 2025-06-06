import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import postsRoutes from "./routes/posts.js";

const app = new Hono();

// CORS middleware
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Social media API routes
app.route("/api/posts", postsRoutes);
app.route("/api/likes", likesRoutes);
app.route("/api/comments", commentsRoutes);

// Better Auth routes (must be after specific routes)
app.use("/api/auth/*", (c) => auth.handler(c.req.raw));

// Health check route
app.get("/", (c) => {
  return c.json({ message: "Layer 0 Backend API", status: "running" });
});

// Protected API example
app.get("/api/me", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ user: session.user, session: session.session });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Layer 0 Backend running on http://localhost:${info.port}`);
    console.log(`Auth endpoint: http://localhost:${info.port}/api/auth`);
  }
);
