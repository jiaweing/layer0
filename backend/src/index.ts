import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { database } from "./lib/database.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import postsRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";

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
app.route("/api/users", usersRoutes);

// Health check route
app.get("/", (c) => {
  return c.json({ message: "Layer 0 Backend API", status: "running" });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Initialize database connection
database.connect().catch(console.error);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Layer 0 Backend running on http://localhost:${info.port}`);
  }
);
