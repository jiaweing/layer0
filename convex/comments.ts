import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a comment
export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    authorAuthId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Create comment
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      content: args.content,
      authorAuthId: args.authorAuthId,
      createdAt: Date.now(),
    });

    // Update post comments count
    await ctx.db.patch(args.postId, {
      commentsCount: post.commentsCount + 1,
    });

    return commentId;
  },
});

// Get comments for a post with author information
export const getPostComments = query({
  args: {
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .take(limit);

    // Get author information for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", comment.authorAuthId))
          .unique();

        return {
          ...comment,
          author,
        };
      })
    );

    return commentsWithAuthors;
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    authorAuthId: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorAuthId !== args.authorAuthId) {
      throw new Error("Unauthorized to delete this comment");
    }

    // Get the post to update comment count
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, {
        commentsCount: Math.max(0, post.commentsCount - 1),
      });
    }

    // Delete the comment
    await ctx.db.delete(args.commentId);
  },
});

// Get user's comments with author and post information
export const getUserComments = query({
  args: {
    authId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorAuthId", args.authId))
      .order("desc")
      .take(limit);

    // Get author and post information for each comment
    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", comment.authorAuthId))
          .unique();

        const post = await ctx.db.get(comment.postId);

        return {
          ...comment,
          author,
          post: post
            ? {
                _id: post._id,
                content:
                  post.content.substring(0, 100) +
                  (post.content.length > 100 ? "..." : ""),
                authorAuthId: post.authorAuthId,
              }
            : null,
        };
      })
    );
    return commentsWithDetails;
  },
});
