import { auth } from "@/lib/auth-server";
import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export async function POST(request: Request) {
  try {
    const { content, teamId, organizationId } = await request.json();
    
    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }    // Get the user from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find or create the user in Convex
    const users = await convex.query(api.users.getUserByAuthId, {
      authId: session.user.id,
    });

    let user = users;
    if (!user) {
      // Create user in Convex if doesn't exist
      await convex.mutation(api.users.createUser, {
        authId: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      });
      
      user = await convex.query(api.users.getUserByAuthId, {
        authId: session.user.id,
      });
    }

    if (!user) {
      return Response.json({ error: "Failed to get user" }, { status: 500 });
    }

    // Create the post using a server-side convex client
    const postId = await convex.mutation(api.posts.createPostServer, {
      content,
      authorAuthId: session.user.id,
      teamId: teamId || undefined,
      organizationId: organizationId || undefined,
    });

    return Response.json({ success: true, postId });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}
