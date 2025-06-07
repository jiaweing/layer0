import { useS3Upload } from "@/hooks/use-s3-upload";
import {
  Heart,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  Share,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../components/providers/auth";
import { Button } from "../components/ui/button";
import {
  useConvexAPI,
  useConvexQueries,
  type Comment,
  type ConvexPost,
  type User,
} from "../lib/convex-api";

interface PostCardProps {
  post: ConvexPost;
  onLike: (postId: Id<"posts">) => void;
  onComment: (postId: Id<"posts">, content: string) => void;
  postAuthor?: User;
}

function PostCard({ post, onLike, onComment, postAuthor }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const { useHasUserLikedPost, usePostComments } = useConvexQueries();

  const isLiked = useHasUserLikedPost(post._id, user?.id);
  const comments = usePostComments(showComments ? post._id : undefined);

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
          {postAuthor?.name?.[0] || postAuthor?.email?.[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">
              {postAuthor?.name || postAuthor?.email}
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
      </div>

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
          {comments?.map((comment: Comment) => (
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, uploadProgress } = useS3Upload({
    folder: "posts",
    onUploadComplete: (url: string) => {
      setUploadedImageUrl(url);
    },
    onError: (error: Error) => {
      console.error("Image upload failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // Use uploaded image URL if available, otherwise use manual URL input
      const finalImageUrl = uploadedImageUrl || imageUrl || undefined;
      onSubmit(content, finalImageUrl);
      setContent("");
      setImageUrl("");
      setUploadedImageUrl("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const removeUploadedImage = () => {
    setUploadedImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImageUrl = uploadedImageUrl || imageUrl;

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
            {displayImageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-border/50 max-w-sm">
                <img
                  src={displayImageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeUploadedImage}
                  className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {!uploadedImageUrl && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Add image URL (optional)"
                className="w-full px-0 py-2 border-0 border-b border-border/30 focus:outline-none focus:border-primary/50 bg-transparent text-sm placeholder:text-muted-foreground/60"
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center pl-13">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-full p-2 hover:bg-primary/10 text-primary"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            {isUploading && (
              <div className="text-xs text-muted-foreground">
                Uploading... {Math.round(uploadProgress)}%
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!content.trim() || isUploading}
            className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const convexAPI = useConvexAPI();
  const { usePosts } = useConvexQueries();
  // For now, use basic pagination instead of infinite scroll
  const [limit] = useState(20);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const postsData = usePosts(limit, cursor);
  const [allPosts, setAllPosts] = useState<ConvexPost[]>([]);

  // Update posts when data changes
  useEffect(() => {
    if (postsData?.posts) {
      if (cursor === undefined) {
        // Initial load
        setAllPosts(postsData.posts);
      } else {
        // Load more
        setAllPosts((prev) => [...prev, ...postsData.posts]);
      }
    }
  }, [postsData, cursor]);

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!user?.id) return;

    try {
      await convexAPI.createPost({
        content,
        authorAuthId: user.id,
        imageUrl,
      });
      // Reset to load fresh posts
      setCursor(undefined);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLike = async (postId: Id<"posts">) => {
    if (!user?.id) return;

    try {
      await convexAPI.toggleLike(postId, user.id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleComment = async (postId: Id<"posts">, content: string) => {
    if (!user?.id) return;

    try {
      await convexAPI.createComment(postId, content, user.id);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleLoadMore = () => {
    if (postsData?.nextCursor) {
      setCursor(postsData.nextCursor);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold tracking-tighter mb-4">
            Welcome to Layer0
          </h2>
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

  if (postsData === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading posts...</p>
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
        {allPosts.length === 0 ? (
          <div className="text-center py-12 px-6">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {allPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                // For now, we'll need to handle user data separately
                // This is a simplified version - in production you'd want to
                // enrich posts with user data
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {postsData?.nextCursor && (
          <div className="text-center py-6 border-t border-border/50">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="rounded-full px-6"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
