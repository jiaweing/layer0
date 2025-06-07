"use client";

import { ProtectedRoute } from "@/components/auth";
import { GroupList } from "@/components/groups";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function GroupsPage() {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Groups</h1>
              <p className="text-gray-600">Join or create groups to connect with others</p>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
            >
              ← Back to Feed
            </Button>
          </div>
          
          <GroupList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
