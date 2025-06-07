import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(), // Better Auth user ID from MongoDB
    name: v.optional(v.string()),
    email: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_auth_id", ["authId"]),
  posts: defineTable({
    content: v.string(),
    authorAuthId: v.string(), // Better Auth user ID from MongoDB
    imageUrl: v.optional(v.string()),
    teamId: v.optional(v.string()), // Better Auth team ID (channel)
    organizationId: v.optional(v.string()), // Better Auth organization ID (group)
    createdAt: v.number(),
    likesCount: v.number(),
    commentsCount: v.number(),
  })
    .index("by_author", ["authorAuthId"])
    .index("by_created_at", ["createdAt"])
    .index("by_team", ["teamId"])
    .index("by_organization", ["organizationId"])
    .index("by_team_created_at", ["teamId", "createdAt"]),

  likes: defineTable({
    postId: v.id("posts"),
    userAuthId: v.string(), // Better Auth user ID from MongoDB
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userAuthId"])
    .index("by_post_user", ["postId", "userAuthId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorAuthId: v.string(), // Better Auth user ID from MongoDB
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorAuthId"])
    .index("by_created_at", ["createdAt"]),
});
