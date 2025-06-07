"use client";

import { ProtectedRoute } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/convex-api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

interface Group {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export default function ChannelPage() {
  const navigate = useNavigate();
  const { groupId, channelId } = useParams<{
    groupId: string;
    channelId: string;
  }>();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  // Query posts for this channel
  const posts = useQuery(
    api.posts.getPostsByTeam,
    channelId ? { teamId: channelId } : "skip"
  );

  useEffect(() => {
    const loadChannelAndGroup = async () => {
      if (!groupId || !channelId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Set the organization as active to access its details
        await authClient.organization.setActive({ organizationId: groupId });

        // Get group details
        const groupResult = await authClient.organization.getFullOrganization();
        if (groupResult.error) {
          setError("Failed to load group");
          return;
        }
        setGroup(groupResult.data);

        // Get teams/channels for this organization
        const teamsResult = await authClient.organization.listTeams({
          query: { organizationId: groupId },
        });

        if (teamsResult.error) {
          setError("Failed to load channel");
          return;
        }

        const channels = teamsResult.data as Channel[];
        const foundChannel = channels.find((c) => c.id === channelId);

        if (!foundChannel) {
          setError("Channel not found");
          return;
        }

        setChannel(foundChannel);
      } catch (err) {
        console.error("Failed to load channel:", err);
        setError("Failed to load channel");
      } finally {
        setIsLoading(false);
      }
    };

    loadChannelAndGroup();
  }, [groupId, channelId]);
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !channelId || !groupId) return;

    setIsCreatingPost(true);
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPostContent.trim(),
          teamId: channelId,
          organizationId: groupId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      setNewPostContent("");
      // Refresh posts by reloading the page
      window.location.reload();
    } catch (error) {
      console.error("Failed to create post:", error);
      // eslint-disable-next-line no-alert
      alert(`Failed to create post: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading channel...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !channel || !group) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Channel Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The channel you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/groups")}>
              ← Back to Groups
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                #
              </div>
              <div>
                <h1 className="text-2xl font-bold">#{channel.name}</h1>
                <p className="text-gray-600">in {group.name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => navigate(`/groups/${groupId}`)}
                variant="outline"
              >
                ← Back to {group.name}
              </Button>
              <Button onClick={() => navigate("/groups")} variant="outline">
                All Groups
              </Button>
            </div>
          </div>

          {/* Create Post Form */}
          <Card className="p-6 mb-6">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Share something with #{channel.name}
                </label>
                <textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  disabled={isCreatingPost}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isCreatingPost || !newPostContent.trim()}
                >
                  {isCreatingPost ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Posts</h2>

            {!posts ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className="p-6 animate-pulse bg-gray-100 h-24"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  No posts in this channel yet.
                </p>
                <p className="text-sm text-gray-400">
                  Be the first to share something!
                </p>
              </Card>
            ) : (              <div className="space-y-4">
                {posts.map((post: typeof posts[0]) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    _creationTime: number;
    author?: {
      name?: string;
    } | null;
    likesCount?: number;
    commentsCount?: number;
  };
}

function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();
  
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {authorInitial}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium">{authorName}</span>
            <span className="text-sm text-gray-500">
              {new Date(post._creationTime).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <button type="button" className="hover:text-blue-600">
              👍 {post.likesCount || 0}
            </button>
            <button type="button" className="hover:text-blue-600">
              💬 {post.commentsCount || 0}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
