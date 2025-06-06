import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../components/providers/auth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { apiService, type Post } from "../lib/api";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const { data: isLiked } = useQuery({
    queryKey: ["postLike", post._id, user?.id],
    queryFn: () => apiService.hasUserLikedPost(post._id),
    enabled: Boolean(user),
  });

  const { data: comments } = useQuery({
    queryKey: ["postComments", post._id],
    queryFn: () => apiService.getPostComments(post._id),
    enabled: showComments,
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText("");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="p-6 space-y-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {post.author?.name?.[0] || post.author?.email?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium">
              {post.author?.name || post.author?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>{" "}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full rounded-lg max-h-96 object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post._id)}
            className={`flex items-center space-x-2 ${
              isLiked ? "text-red-500" : ""
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{post.likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 border-t pt-4">
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" size="sm" disabled={!commentText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Comments List */}
          {comments?.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {comment.author?.name?.[0] || comment.author?.email?.[0] || "?"}
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <p className="font-medium text-sm">
                    {comment.author?.name || comment.author?.email}
                  </p>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

interface CreatePostFormProps {
  onSubmit: (content: string, imageUrl?: string) => void;
}

function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, imageUrl || undefined);
      setContent("");
      setImageUrl("");
    }
  };

  if (!user) return null;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {user.name?.[0] || user.email?.[0] || "?"}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!content.trim()}>
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: postsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      apiService.getPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as number | undefined,
    enabled: Boolean(user),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { content: string; imageUrl?: string }) =>
      apiService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => apiService.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postLike"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      apiService.createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postComments"] });
    },
  });

  const handleCreatePost = (content: string, imageUrl?: string) => {
    createPostMutation.mutate({ content, imageUrl });
  };

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleComment = (postId: string, content: string) => {
    commentMutation.mutate({ postId, content });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Social Feed</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to see and create posts.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-muted-foreground">
            Failed to load posts. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Social Feed</h1>
      {/* Create Post */}
      <div className="mb-8">
        <CreatePostForm onSubmit={handleCreatePost} />
      </div>{" "}
      {/* Posts Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : postsData?.pages?.[0]?.posts?.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something!
            </p>
          </Card>
        ) : (
          postsData?.pages?.map((page) =>
            page.posts.map((post: Post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          )
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="text-center py-4">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
            >
              {isFetchingNextPage ? "Loading..." : "Load More Posts"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
