import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";

// Toggle like on a post
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userAuthId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user has already liked this post
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userAuthId", args.userAuthId)
      )
      .unique();

    if (existingLike) {
      // Unlike: remove the like
      await ctx.db.delete(existingLike._id);

      // Decrease post likes count
      await ctx.db.patch(args.postId, {
        likesCount: Math.max(0, post.likesCount - 1),
      });

      return { liked: false };
    } else {
      // Like: add a new like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userAuthId: args.userAuthId,
        createdAt: Date.now(),
      });

      // Increase post likes count
      await ctx.db.patch(args.postId, {
        likesCount: post.likesCount + 1,
      });

      return { liked: true };
    }
  },
});

// Check if user has liked a post
export const hasUserLikedPost = query({
  args: {
    postId: v.id("posts"),
    userAuthId: v.string(),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userAuthId", args.userAuthId)
      )
      .unique();

    return !!like;
  },
});

// Get likes for a post
export const getPostLikes = query({
  args: {
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .take(limit);

    // Return likes with userAuthId (MongoDB users will be fetched on frontend)
    return likes.map((like) => ({
      ...like,
      userAuthId: like.userAuthId,
    }));
  },
});

// Get user's likes
export const getUserLikes = query({
  args: {
    authId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userAuthId", args.authId))
      .order("desc")
      .take(limit);

    // Get post information for each like
    const likesWithPosts = await Promise.all(
      likes.map(async (like) => {
        const post = await ctx.db.get(like.postId);
        return {
          ...like,
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

    return likesWithPosts;
  },
});
