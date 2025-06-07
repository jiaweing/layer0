"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CreateChannelDialog } from "./create-channel-dialog";

interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

interface ChannelListProps {
  organizationId: string;
}

export function ChannelList({ organizationId }: ChannelListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [teams, setTeams] = useState<Channel[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsPending(true);
        const result = await authClient.organization.listTeams({
          query: {
            organizationId,
          },
        });

        if (result.error) {
          setError(result.error.message || "Failed to load channels");
        } else {
          setTeams((result.data as Channel[]) || []);
        }
      } catch (err) {
        setError("Failed to load channels");
      } finally {
        setIsPending(false);
      }
    };

    loadTeams();
  }, [organizationId]);

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Channels</h2>
          <Button disabled>Loading...</Button>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Channels</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Channel
          </Button>
        </div>
        <Card className="p-4 text-center text-red-600">{error}</Card>
        <CreateChannelDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          organizationId={organizationId}
        />
      </div>
    );
  }

  const channels = teams || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Channels</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          Create Channel
        </Button>
      </div>

      {channels.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No channels created yet.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create First Channel
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {channels.map((channel: Channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              organizationId={organizationId}
            />
          ))}
        </div>
      )}

      <CreateChannelDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        organizationId={organizationId}
      />
    </div>
  );
}

interface ChannelCardProps {
  channel: Channel;
  organizationId: string;
}

function ChannelCard({ channel }: ChannelCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete the channel "${channel.name}"?`
    );
    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await authClient.organization.removeTeam({
        teamId: channel.id,
      });
    } catch (error) {
      console.error("Failed to delete channel:", error);
      window.alert("Failed to delete channel. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewChannel = () => {
    window.location.href = `/feed?teamId=${channel.id}`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            #
          </div>
          <div>
            <h3 className="font-medium">#{channel.name}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleViewChannel}>
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700"
          >
            {isDeleting ? "..." : "Delete"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
