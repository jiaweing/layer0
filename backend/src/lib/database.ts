import mongoose from "mongoose";

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  emailVerified?: boolean;
  image?: string; // Add avatar field
  createdAt?: Date;
  updatedAt?: Date;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/layer0-auth";

      await mongoose.connect(mongoUri, {
        dbName: "layer0-auth",
      });

      this.isConnected = true;
      console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Failed to disconnect from MongoDB:", error);
      throw error;
    }
  }

  public getConnection() {
    return mongoose.connection;
  }

  public isConnectionReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// User service using Mongoose native MongoDB driver access
export class UserService {
  private static userCollection = "user"; // Better Auth collection name

  public static async findUserById(
    authId: string
  ): Promise<UserDocument | null> {
    try {
      const dbInstance = DatabaseConnection.getInstance();
      if (!dbInstance.isConnectionReady()) {
        await dbInstance.connect();
      }

      const db = dbInstance.getConnection().db;
      if (!db) {
        throw new Error("Database connection not available");
      }

      // Convert string ID to ObjectId for MongoDB query
      const objectId = new mongoose.Types.ObjectId(authId);
      const user = await db
        .collection(this.userCollection)
        .findOne({ _id: objectId });

      if (!user) return null;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  public static async findUsersByIds(
    authIds: string[]
  ): Promise<Record<string, UserDocument>> {
    try {
      const dbInstance = DatabaseConnection.getInstance();
      if (!dbInstance.isConnectionReady()) {
        await dbInstance.connect();
      }

      const db = dbInstance.getConnection().db;
      if (!db) {
        throw new Error("Database connection not available");
      }

      // Convert string IDs to ObjectIds for MongoDB query
      const objectIds = authIds.map((id) => new mongoose.Types.ObjectId(id));
      const users = await db
        .collection(this.userCollection)
        .find({
          _id: { $in: objectIds },
        })
        .toArray();

      const userMap: Record<string, UserDocument> = {};

      users.forEach((user) => {
        // Use string representation of ObjectId as key
        const userIdString = user._id.toString();
        userMap[userIdString] = {
          _id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });

      return userMap;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      return {};
    }
  }

  public static async updateUserAvatar(
    authId: string,
    avatarUrl: string
  ): Promise<UserDocument | null> {
    try {
      const dbInstance = DatabaseConnection.getInstance();
      if (!dbInstance.isConnectionReady()) {
        await dbInstance.connect();
      }

      const db = dbInstance.getConnection().db;
      if (!db) {
        throw new Error("Database connection not available");
      }

      const objectId = new mongoose.Types.ObjectId(authId);
      const result = await db
        .collection(this.userCollection)
        .findOneAndUpdate(
          { _id: objectId },
          {
            $set: {
              image: avatarUrl,
              updatedAt: new Date(),
            },
          },
          { returnDocument: "after" }
        );

      if (!result || !result.value) return null;

      const user = result.value;
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error updating user avatar:", error);
      return null;
    }
  }

  public static async removeUserAvatar(
    authId: string
  ): Promise<UserDocument | null> {
    try {
      const dbInstance = DatabaseConnection.getInstance();
      if (!dbInstance.isConnectionReady()) {
        await dbInstance.connect();
      }

      const db = dbInstance.getConnection().db;
      if (!db) {
        throw new Error("Database connection not available");
      }

      const objectId = new mongoose.Types.ObjectId(authId);
      const result = await db
        .collection(this.userCollection)
        .findOneAndUpdate(
          { _id: objectId },
          {
            $unset: { image: "" },
            $set: { updatedAt: new Date() },
          },
          { returnDocument: "after" }
        );

      if (!result || !result.value) return null;

      const user = result.value;
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error removing user avatar:", error);
      return null;
    }
  }

  public static transformToApiUser(user: UserDocument) {
    return {
      _id: user._id.toString(),
      name: user.name || user.email.split("@")[0], // fallback to email prefix if no name
      email: user.email,
      image: user.image,
    };
  }
}

// Export singleton instance
export const database = DatabaseConnection.getInstance();

export type { UserDocument };
