import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    teamId: v.optional(v.string()), // Better Auth team ID (channel)
    organizationId: v.optional(v.string()), // Better Auth organization ID (group)
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    let query = ctx.db.query("posts");
    
    // Filter by team (channel) if provided
    if (args.teamId) {
      query = query.filter((q) => q.eq(q.field("teamId"), args.teamId));
    }
    // Filter by organization (group) if provided and no team specified
    else if (args.organizationId) {
      query = query.filter((q) => q.eq(q.field("organizationId"), args.organizationId));
    }
    // For global feed, only show posts without team/organization
    else {
      query = query.filter((q) => 
        q.and(
          q.eq(q.field("teamId"), undefined),
          q.eq(q.field("organizationId"), undefined)
        )
      );
    }
      const posts = await query
      .order("desc")
      .paginate({
        cursor: args.cursor || null,
        numItems: limit,
      });

    // Get user data for each post
    const postsWithUsers = await Promise.all(
      posts.page.map(async (post) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", post.authorAuthId))
          .first();

        return {
          ...post,
          author: user,
        };
      })
    );

    return {
      posts: postsWithUsers,
      continueCursor: posts.continueCursor,
      isDone: posts.isDone,
    };
  },
});

export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
    teamId: v.optional(v.string()), // Better Auth team ID (channel)
    organizationId: v.optional(v.string()), // Better Auth organization ID (group)
  },
  handler: async (ctx, args) => {
    // Get the current user's auth ID from the context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const postId = await ctx.db.insert("posts", {
      content: args.content,
      imageUrl: args.imageUrl,
      authorAuthId: user.authId,
      teamId: args.teamId,
      organizationId: args.organizationId,
      createdAt: Date.now(),
      likesCount: 0,
      commentsCount: 0,
    });

    return postId;
  },
});

export const createPostServer = mutation({
  args: {
    content: v.string(),
    authorAuthId: v.string(),
    imageUrl: v.optional(v.string()),
    teamId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      content: args.content,
      imageUrl: args.imageUrl,
      authorAuthId: args.authorAuthId,
      teamId: args.teamId,
      organizationId: args.organizationId,
      createdAt: Date.now(),
      likesCount: 0,
      commentsCount: 0,
    });

    return postId;
  },
});

export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const author = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", post.authorAuthId))
      .first();

    return {
      ...post,
      author,
    };
  },
});

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

    const author = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .first();

    const postsWithAuthor = posts.map((post) => ({
      ...post,
      author,
    }));

    return postsWithAuthor;
  },
});

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

export const getPostsByTeam = query({
  args: {
    teamId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .order("desc")
      .paginate({
        cursor: args.cursor || null,
        numItems: limit,
      });

    // Get user data for each post
    const postsWithUsers = await Promise.all(
      posts.page.map(async (post) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", post.authorAuthId))
          .first();

        return {
          ...post,
          author: user,
        };
      })
    );

    return postsWithUsers;
  },
});
