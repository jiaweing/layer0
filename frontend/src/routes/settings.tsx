"use client";

import { ProtectedRoute } from "@/components/auth";
import ProfileAvatar from "@/components/profile-avatar";
import { useAuth } from "@/components/providers/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/lib/auth";
import {
  Calendar,
  Clock,
  Globe,
  Mail,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

function SettingsPage() {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account and session information
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="ml-4"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Profile Avatar Section */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Avatar
                </CardTitle>
                <CardDescription>
                  Upload and manage your profile picture
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 flex justify-center">                <ProfileAvatar
                  currentAvatar={user?.image}
                  onAvatarChange={() => {
                    // Avatar update is handled automatically by the hook
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Information Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Information Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email</span>
                  </div>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Name</span>
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Email Verified
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      user?.emailVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Account Created
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {user?.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                  </span>
                </div>

                {user?.image && (
                  <div className="flex items-center justify-between py-3 border-t">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Profile Image
                      </span>
                    </div>
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Session Information Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Session Information
                </CardTitle>
                <CardDescription>
                  Current session and security details
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Session ID
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {session?.id ? `${session.id.slice(0, 8)}...` : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Session Created
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {session?.createdAt ? formatDate(session.createdAt) : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Expires At
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {session?.expiresAt ? formatDate(session.expiresAt) : "N/A"}
                  </span>
                </div>

                {session?.ipAddress && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        IP Address
                      </span>
                    </div>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {session.ipAddress}
                    </span>
                  </div>
                )}

                {session?.userAgent && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        User Agent
                      </span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded max-w-40 truncate">
                      {session.userAgent}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {session?.updatedAt ? formatDate(session.updatedAt) : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="px-8"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default SettingsPage;