"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Export types that components will use
export interface User {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  bio?: string;
}

export interface ConvexPost {
  _id: Id<"posts">;
  content: string;
  authorAuthId: string;
  imageUrl?: string;
  createdAt: number;
  likesCount: number;
  commentsCount: number;
}

export interface Post extends Omit<ConvexPost, "authorAuthId"> {
  author: User;
}

export interface Comment {
  _id: Id<"comments">;
  content: string;
  createdAt: number;
  postId: Id<"posts">;
  authorAuthId: string;
  author?: User; // Populated in components
}

export interface PostsResponse {
  posts: ConvexPost[];
  nextCursor?: number | null;
}

// Custom hooks for Convex operations
export const useConvexAPI = () => {
  // Posts
  const createPostMutation = useMutation(api.posts.createPost);
  const deletePostMutation = useMutation(api.posts.deletePost);

  // Likes
  const toggleLikeMutation = useMutation(api.likes.toggleLike);

  // Comments
  const createCommentMutation = useMutation(api.comments.createComment);
  const deleteCommentMutation = useMutation(api.comments.deleteComment);

  return {
    // Posts
    createPost: async (data: {
      content: string;
      authorAuthId: string;
      imageUrl?: string;
    }) => {
      return await createPostMutation(data);
    },

    deletePost: async (postId: Id<"posts">, authorAuthId: string) => {
      return await deletePostMutation({ postId, authorAuthId });
    },

    // Likes
    toggleLike: async (postId: Id<"posts">, userAuthId: string) => {
      return await toggleLikeMutation({ postId, userAuthId });
    },

    // Comments
    createComment: async (
      postId: Id<"posts">,
      content: string,
      authorAuthId: string
    ) => {
      return await createCommentMutation({ postId, content, authorAuthId });
    },

    deleteComment: async (commentId: Id<"comments">, authorAuthId: string) => {
      return await deleteCommentMutation({ commentId, authorAuthId });
    },
  };
};

// Custom hooks for queries
export const useConvexQueries = () => {
  return {
    usePosts: (limit?: number, cursor?: number) => {
      return useQuery(api.posts.getPosts, { limit, cursor });
    },

    usePost: (postId: Id<"posts"> | undefined) => {
      return useQuery(api.posts.getPost, postId ? { postId } : "skip");
    },

    useUserPosts: (authId: string | undefined, limit?: number) => {
      return useQuery(
        api.posts.getUserPosts,
        authId ? { authId, limit } : "skip"
      );
    },

    useHasUserLikedPost: (
      postId: Id<"posts"> | undefined,
      userAuthId: string | undefined
    ) => {
      return useQuery(
        api.likes.hasUserLikedPost,
        postId && userAuthId ? { postId, userAuthId } : "skip"
      );
    },

    usePostLikes: (postId: Id<"posts"> | undefined) => {
      return useQuery(api.likes.getPostLikes, postId ? { postId } : "skip");
    },
    useUserLikes: (userAuthId: string | undefined) => {
      return useQuery(
        api.likes.getUserLikes,
        userAuthId ? { authId: userAuthId } : "skip"
      );
    },

    usePostComments: (postId: Id<"posts"> | undefined, limit?: number) => {
      return useQuery(
        api.comments.getPostComments,
        postId ? { postId, limit } : "skip"
      );
    },

    useUserComments: (authId: string | undefined) => {
      return useQuery(
        api.comments.getUserComments,
        authId ? { authId } : "skip"
      );
    },
  };
};

// Legacy API service for user operations (will remain HTTP-based for now)
// These operations are handled by Better Auth and don't need to move to Convex
export const legacyApiService = {
  // Users - these remain as HTTP calls since they interact with Better Auth
  getOrCreateUser: async (userData: {
    email: string;
    name?: string;
    image?: string;
  }) => {
    const api = (await import("./api")).api;
    const response = await api.post("/api/users/profile", userData);
    return response.data;
  },

  updateProfile: async (userData: {
    name?: string;
    bio?: string;
    image?: string;
  }) => {
    const api = (await import("./api")).api;
    const response = await api.put("/api/users/profile", userData);
    return response.data;
  },

  uploadAvatar: async (authId: string, file: File): Promise<User> => {
    const api = (await import("./api")).api;
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(`/api/users/${authId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.user;
  },

  removeAvatar: async (authId: string): Promise<User> => {
    const api = (await import("./api")).api;
    const response = await api.delete(`/api/users/${authId}/avatar`);
    return response.data.user;
  },
};
