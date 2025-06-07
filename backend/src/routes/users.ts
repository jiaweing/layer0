import { Hono } from "hono";
import { UserService } from "../lib/database.js";

const app = new Hono();

// Get user by auth ID
app.get("/:authId", async (c) => {
  try {
    const authId = c.req.param("authId");
    
    const user = await UserService.findUserById(authId);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(UserService.transformToApiUser(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Get multiple users by auth IDs
app.post("/batch", async (c) => {
  try {
    const body = await c.req.json();
    const { authIds } = body;
    
    if (!Array.isArray(authIds)) {
      return c.json({ error: "authIds must be an array" }, 400);
    }

    const userMap = await UserService.findUsersByIds(authIds);
    
    // Transform to API format
    const transformedUsers: Record<string, any> = {};
    Object.keys(userMap).forEach(id => {
      transformedUsers[id] = UserService.transformToApiUser(userMap[id]);
    });

    return c.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

export default app;
