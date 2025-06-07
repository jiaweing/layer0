"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateGroupDialog } from "./create-group-dialog";

interface Group {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, any>;
}

export function GroupList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [organizations, setOrganizations] = useState<Group[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadOrganizations = async () => {
    try {
      setIsPending(true);
      setError(null);
      console.log("Loading organizations...");
      const result = await authClient.organization.list();
      console.log("Organizations result:", result);
      
      if (result.error) {
        console.error("Error loading organizations:", result.error);
        setError(result.error.message || "Failed to load groups");
      } else {
        console.log("Organizations data:", result.data);
        setOrganizations((result.data as Group[]) || []);
      }
    } catch (err) {
      console.error("Exception loading organizations:", err);
      setError("Failed to load groups");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);
  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Groups</h2>
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
          <h2 className="text-xl font-semibold">Groups</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Group
          </Button>
        </div>
        <Card className="p-4 text-center text-red-600">
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={loadOrganizations}>
              Retry
            </Button>
          </div>
        </Card>
        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onGroupCreated={loadOrganizations}
        />
      </div>
    );
  }

  const groups = organizations || [];
  
  console.log("GroupList render state:", { 
    isPending, 
    error, 
    groupsLength: groups.length, 
    showCreateDialog,
    organizations 
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Groups</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Your First Group
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGroupCreated={loadOrganizations}
      />
    </div>
  );
}

interface GroupCardProps {
  group: Group;
}

function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();

  const handleEnterGroup = () => {
    navigate(`/groups/${group.id}`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {group.logo ? (
            <img
              src={group.logo}
              alt={group.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {group.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-medium">{group.name}</h3>
            <p className="text-sm text-gray-500">@{group.slug}</p>
          </div>
        </div>        <Button
          variant="outline"
          size="sm"
          onClick={handleEnterGroup}
        >
          Enter
        </Button>
      </div>
    </Card>
  );
}
