import { auth } from "@/lib/auth-server";
import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Get the session from the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { user } = session; // Sync user data to Convex
    await convex.mutation(api.users.upsertUser, {
      authId: user.id,
      name: user.name || undefined,
      email: user.email,
      image: user.image || undefined,
    });

    return NextResponse.json({
      message: "User synced successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
