import { Hono } from "hono";
import { api } from "../../convex/_generated/api.js";
import { auth } from "../lib/auth.js";
import { convex } from "../lib/convex.js";
import { UserService } from "../lib/database.js";

const app = new Hono();

// Helper function to enrich comments with author information
async function enrichCommentsWithAuthors(comments: any[]) {
  if (!comments.length) return comments;

  // Get unique author IDs
  const authorIds = [
    ...new Set(comments.map((comment) => comment.authorAuthId)),
  ];

  // Fetch users using the UserService
  const userMap = await UserService.findUsersByIds(authorIds);

  // Enrich comments with author data
  return comments.map((comment) => ({
    ...comment,
    author: userMap[comment.authorAuthId]
      ? UserService.transformToApiUser(userMap[comment.authorAuthId])
      : {
          _id: comment.authorAuthId,
          name: "Unknown User",
          email: "unknown@example.com",
        },
  }));
}

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

// Get comments for a post
app.get("/post/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const limit = parseInt(c.req.query("limit") || "50");

    const comments = await convex.query(api.comments.getPostComments, {
      postId: postId as any,
      limit,
    });

    // Enrich comments with author information
    const enrichedComments = await enrichCommentsWithAuthors(comments);

    return c.json({ comments: enrichedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
});

// Create a comment
app.post("/", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const { postId, content } = body;

    if (!content || content.trim().length === 0) {
      return c.json({ error: "Content is required" }, 400);
    }

    const commentId = await convex.mutation(api.comments.createComment, {
      postId: postId as any,
      content: content.trim(),
      authorAuthId: user.id,
    });

    return c.json({ commentId, success: true });
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

// Delete a comment
app.delete("/:commentId", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const commentId = c.req.param("commentId");

    await convex.mutation(api.comments.deleteComment, {
      commentId: commentId as any,
      authorAuthId: user.id,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return c.json({ error: "Failed to delete comment" }, 500);
  }
});

// Get user's comments
app.get("/user/:authId", async (c) => {
  try {
    const authId = c.req.param("authId");
    const limit = parseInt(c.req.query("limit") || "20");

    const comments = await convex.query(api.comments.getUserComments, {
      authId,
      limit,
    });

    // Enrich comments with author information
    const enrichedComments = await enrichCommentsWithAuthors(comments);

    return c.json({ comments: enrichedComments });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return c.json({ error: "Failed to fetch user comments" }, 500);
  }
});

export default app;
