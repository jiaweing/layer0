import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    authorAuthId: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      content: args.content,
      authorAuthId: args.authorAuthId,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      likesCount: 0,
      commentsCount: 0,
    });

    return postId;
  },
});

// Get posts for feed (paginated) with author information
export const getPosts = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const cursor = args.cursor ?? Date.now();

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created_at", (q) => q.lt("createdAt", cursor))
      .order("desc")
      .take(limit);

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", post.authorAuthId))
          .unique();

        return {
          ...post,
          author,
        };
      })
    );

    return {
      posts: postsWithAuthors,
      nextCursor:
        posts.length === limit ? posts[posts.length - 1]?.createdAt : null,
    };
  },
});

// Get a single post with details and author information
export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // Get author information
    const author = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", post.authorAuthId))
      .unique();

    return {
      ...post,
      author,
    };
  },
});

// Get user's posts with author information
export const getUserPosts = query({
  args: {
    authId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorAuthId", args.authId))
      .order("desc")
      .take(limit);

    // Get author information for the posts
    const author = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .unique();

    const postsWithAuthor = posts.map((post) => ({
      ...post,
      author,
    }));

    return postsWithAuthor;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    authorAuthId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorAuthId !== args.authorAuthId) {
      throw new Error("Unauthorized to delete this post");
    }

    // Delete associated likes and comments
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Delete all likes
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete all comments
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});
