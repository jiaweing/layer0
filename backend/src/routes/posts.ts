import { Hono } from "hono";
import { api } from "../../convex/_generated/api.js";
import { auth } from "../lib/auth.js";
import { convex } from "../lib/convex.js";

const app = new Hono();

// Helper function to get authenticated user
async function getAuthenticatedUser(c: any) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
}

// Get posts feed
app.get("/", async (c) => {
  try {
    const limit = parseInt(c.req.query("limit") || "20");
    const cursor = c.req.query("cursor")
      ? parseInt(c.req.query("cursor")!)
      : undefined;

    const result = await convex.query(api.posts.getPosts, {
      limit,
      cursor,
    });

    return c.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// Create a new post
app.post("/", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const { content, imageUrl } = body;

    if (!content || content.trim().length === 0) {
      return c.json({ error: "Content is required" }, 400);
    }

    const postId = await convex.mutation(api.posts.createPost, {
      content: content.trim(),
      authorAuthId: user.id,
      imageUrl,
    });

    return c.json({ postId, success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Get a specific post
app.get("/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const post = await convex.query(api.posts.getPost, {
      postId: postId as any,
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

// Delete a post
app.delete("/:postId", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const postId = c.req.param("postId");

    await convex.mutation(api.posts.deletePost, {
      postId: postId as any,
      authorAuthId: user.id,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

// Get user's posts
app.get("/user/:authId", async (c) => {
  try {
    const authId = c.req.param("authId");
    const limit = parseInt(c.req.query("limit") || "20");

    const posts = await convex.query(api.posts.getUserPosts, {
      authId,
      limit,
    });

    return c.json({ posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return c.json({ error: "Failed to fetch user posts" }, 500);
  }
});

export default app;
