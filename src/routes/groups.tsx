"use client";

import { ProtectedRoute } from "@/components/auth";
import { GroupList } from "@/components/groups/group-list";
import { ChannelList } from "@/components/groups/channel-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth";
import { authClient } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function GroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeOrganization, setActiveOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActiveOrganization = async () => {
      try {
        const result = await authClient.organization.getFullOrganization();
        if (result.data) {
          setActiveOrganization(result.data);
        }
      } catch (error) {
        console.error("Failed to load active organization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveOrganization();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading groups...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Groups</h1>
                <p className="text-muted-foreground">
                  Manage your groups and channels
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="ml-4"
              >
                ← Back to Feed
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Groups Section */}
            <Card className="p-6">
              <GroupList />
            </Card>

            {/* Channels Section */}
            <Card className="p-6">
              {activeOrganization ? (
                <ChannelList organizationId={activeOrganization.id} />
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-2">Channels</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a group to manage its channels
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Help Section */}
          <Card className="mt-8 p-6">
            <h2 className="text-lg font-semibold mb-3">About Groups & Channels</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Groups</strong> are like Discord servers - they're communities where you can organize discussions around topics, projects, or interests.
              </p>
              <p>
                <strong>Channels</strong> are like Discord channels within a server - they're spaces within a group for specific conversations or topics.
              </p>
              <p>
                Create groups to build communities, then add channels to organize conversations within those groups.
              </p>
            </div>
          </Card>        </div>
      </div>
    </ProtectedRoute>
  );
}
