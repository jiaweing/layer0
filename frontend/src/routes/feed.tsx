import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Heart,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  Share,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../components/providers/auth";
import { Button } from "../components/ui/button";
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
    <div className="border-b border-border/50 py-4 px-6 hover:bg-muted/30 transition-colors">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {post.author?.name?.[0] || post.author?.email?.[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">
              {post.author?.name || post.author?.email}
            </span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border/50">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post._id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ${
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 text-muted-foreground hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20 text-muted-foreground hover:text-green-500 transition-colors"
            >
              <Repeat2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>{" "}
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pl-13 space-y-3">
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/60 to-primary/40 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {user.name?.[0] || user.email?.[0] || "?"}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Reply..."
                  className="flex-1 px-4 py-2 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim()}
                  className="rounded-full px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Comments List */}
          {comments?.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {comment.author?.name?.[0] || comment.author?.email?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-muted/50 rounded-2xl px-4 py-2">
                  <p className="font-medium text-sm text-foreground">
                    {comment.author?.name || comment.author?.email}
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {comment.content}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-4">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
    <div className="border-b border-border/50 py-6 px-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {user.name?.[0] || user.email?.[0] || "?"}
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's new?"
              className="w-full p-0 border-0 resize-none focus:outline-none bg-transparent text-lg placeholder:text-muted-foreground/60"
              rows={3}
              style={{ minHeight: "60px" }}
            />
            {imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border/50 max-w-sm">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Add image URL (optional)"
              className="w-full px-0 py-2 border-0 border-b border-border/30 focus:outline-none focus:border-primary/50 bg-transparent text-sm placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <div className="flex justify-between items-center pl-13">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full p-2 hover:bg-primary/10 text-primary"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            disabled={!content.trim()}
            className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to Layer0</h2>
          <p className="text-muted-foreground mb-6">
            Join the conversation. Sign in to see and create posts.
          </p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-muted-foreground">
            Failed to load posts. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-background">
      {/* Create Post */}
      <CreatePostForm onSubmit={handleCreatePost} />

      {/* Posts Feed */}
      <div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : postsData?.pages?.[0]?.posts?.length === 0 ? (
          <div className="text-center py-12 px-6">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {postsData?.pages?.map((page) =>
              page.posts.map((post: Post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="text-center py-6 border-t border-border/50">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="rounded-full px-6"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
