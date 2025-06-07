import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update a user
export const upsertUser = mutation({
  args: {
    authId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .unique();

    const userData = {
      authId: args.authId,
      name: args.name,
      email: args.email,
      image: args.image,
      bio: args.bio,
      updatedAt: Date.now(),
    };

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, userData);
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        ...userData,
        createdAt: Date.now(),
      });
      return userId;
    }
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    authId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      authId: args.authId,
      name: args.name,
      email: args.email,
      image: args.image,
      bio: args.bio,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  },
});

// Get a user by their auth ID
export const getUserByAuthId = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .unique();

    return user;
  },
});

// Get multiple users by their auth IDs
export const getUsersByAuthIds = query({
  args: { authIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.authIds.map(async (authId) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_auth_id", (q) => q.eq("authId", authId))
          .unique();
        return user;
      })
    );

    // Return a map of authId to user data for easy lookup
    const userMap: Record<string, any> = {};
    users.forEach((user) => {
      if (user) {
        userMap[user.authId] = user;
      }
    });

    return userMap;
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    authId: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.image !== undefined) updateData.image = args.image;
    if (args.bio !== undefined) updateData.bio = args.bio;

    await ctx.db.patch(user._id, updateData);

    return ctx.db.get(user._id);
  },
});
