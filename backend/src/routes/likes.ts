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

// Toggle like on a post
app.post("/:postId/toggle", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const postId = c.req.param("postId");

    const result = await convex.mutation(api.likes.toggleLike, {
      postId: postId as any,
      userAuthId: user.id,
    });

    return c.json(result);
  } catch (error) {
    console.error("Error toggling like:", error);
    return c.json({ error: "Failed to toggle like" }, 500);
  }
});

// Check if user liked a post
app.get("/:postId/check", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ liked: false });
  }

  try {
    const postId = c.req.param("postId");

    const liked = await convex.query(api.likes.hasUserLikedPost, {
      postId: postId as any,
      userAuthId: user.id,
    });

    return c.json({ liked });
  } catch (error) {
    console.error("Error checking like status:", error);
    return c.json({ liked: false });
  }
});

// Get post likes
app.get("/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");

    const likes = await convex.query(api.likes.getPostLikes, {
      postId: postId as any,
    });

    return c.json({ likes });
  } catch (error) {
    console.error("Error fetching post likes:", error);
    return c.json({ error: "Failed to fetch likes" }, 500);
  }
});

export default app;
