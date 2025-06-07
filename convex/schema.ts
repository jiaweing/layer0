import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    content: v.string(),
    authorAuthId: v.string(), // Better Auth user ID from MongoDB
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    likesCount: v.number(),
    commentsCount: v.number(),
  })
    .index("by_author", ["authorAuthId"])
    .index("by_created_at", ["createdAt"]),

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
