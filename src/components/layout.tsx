"use client";

import { useAuth } from "@/components/providers/auth";
import ThemeToggler from "@/components/theme/toggler";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { signOut } from "@/lib/auth";
import { Heart, Home, LogOut, PlusSquare, Search, User, Users } from "lucide-react";
import { NavLink } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="text-xl font-medium tracking-tighter text-primary"
            >
              {siteConfig.name}
            </NavLink>

            {/* Right side actions */}            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to="/groups">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Groups</span>
                    </NavLink>
                  </Button>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {user?.name || user?.email}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to="/settings">
                      <User className="w-4 h-4" />
                    </NavLink>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
              )}
              <ThemeToggler />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">{children}</main>

      {/* Bottom Navigation (Mobile) */}
      {isAuthenticated && (        <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border md:hidden">
          <div className="flex justify-around items-center h-16 px-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Home className="w-6 h-6" />
            </NavLink>
            <button className="p-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <PlusSquare className="w-6 h-6" />
            </button>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `p-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Users className="w-6 h-6" />
            </NavLink>
            <button className="p-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `p-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <User className="w-6 h-6" />
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
}
