import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface User {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  bio?: string;
}

export interface Post {
  _id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  likesCount: number;
  commentsCount: number;
  author: User;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: number;
  author: User;
  postId: string;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor?: number;
}

// API functions
export const apiService = {
  // Users
  getOrCreateUser: async (userData: {
    email: string;
    name?: string;
    image?: string; // Updated to match backend
  }) => {
    const response = await api.post("/api/users/profile", userData);
    return response.data;
  },

  updateProfile: async (userData: {
    name?: string;
    bio?: string;
    image?: string; // Updated to match backend
  }) => {
    const response = await api.put("/api/users/profile", userData);
    return response.data;
  },

  // Avatar management
  uploadAvatar: async (authId: string, file: File): Promise<User> => {
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
    const response = await api.delete(`/api/users/${authId}/avatar`);
    return response.data.user;
  },

  // Posts
  createPost: async (postData: { content: string; imageUrl?: string }) => {
    const response = await api.post("/api/posts", postData);
    return response.data;
  },
  getPosts: async (cursor?: number, limit = 20): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor.toString());
    params.append("limit", limit.toString());

    const response = await api.get(`/api/posts?${params.toString()}`);
    return response.data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },

  // Likes
  toggleLike: async (postId: string) => {
    const response = await api.post(`/api/likes/${postId}/toggle`);
    return response.data;
  },

  hasUserLikedPost: async (postId: string): Promise<boolean> => {
    const response = await api.get(`/api/likes/${postId}/check`);
    return response.data.liked;
  },

  getPostLikes: async (postId: string) => {
    const response = await api.get(`/api/likes/${postId}`);
    return response.data;
  },

  // Comments
  createComment: async (postId: string, content: string) => {
    const response = await api.post(`/api/comments/${postId}`, { content });
    return response.data;
  },
  getPostComments: async (postId: string, limit = 50): Promise<Comment[]> => {
    const response = await api.get(`/api/comments/${postId}?limit=${limit}`);
    return response.data;
  },
  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  },
};
