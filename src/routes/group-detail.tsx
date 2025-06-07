"use client";

import { ProtectedRoute } from "@/components/auth";
import { ChannelList } from "@/components/groups";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

interface Group {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, any>;
}

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroup = async () => {
      if (!groupId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Set this organization as active to access its details
        await authClient.organization.setActive({ organizationId: groupId });
        
        // Get organization details
        const result = await authClient.organization.getFullOrganization();
        
        if (result.error) {
          setError(result.error.message || "Failed to load group");
        } else if (result.data) {
          setGroup(result.data);
        }
      } catch (err) {
        console.error("Failed to load group:", err);
        setError("Failed to load group");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading group...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !group) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The group you're looking for doesn't exist."}</p>
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
              {group.logo ? (
                <img
                  src={group.logo}
                  alt={group.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {group.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <p className="text-gray-600">@{group.slug}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/groups")}
              variant="outline"
            >
              ← Back to Groups
            </Button>
          </div>
          
          {/* Channels */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Channels</h2>
            <ChannelList organizationId={group.id} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
