import { MongoClient } from "mongodb";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());

export async function connectBlog() {
  if (!process.env.MONGODB_URI)
    throw new Error("Set MONGODB_URI in .env.local");
  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  });
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "portfolio");
    await db.command({ ping: 1 });
    return { client, db, collection: db.collection("posts") };
  } catch {
    await client.close();
    throw new Error(
      "MongoDB connection failed. Check MONGODB_URI, Atlas network access, and database permissions. Credentials are not printed.",
    );
  }
}
export function reportDatabaseError(error) {
  // Driver errors may contain hosts/connection details; do not echo them into logs.
  console.error(
    error?.name?.startsWith("Mongo")
      ? `MongoDB operation failed (${error.code ?? error.name}). Check access permissions and existing indexes; no credentials printed.`
      : error.message,
  );
  process.exitCode = 1;
}
