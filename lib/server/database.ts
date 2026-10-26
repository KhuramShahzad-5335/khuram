import "server-only";
import { MongoClient } from "mongodb";

const globalDatabase = globalThis as typeof globalThis & {
  blogMongo?: Promise<MongoClient>;
};
export async function blogDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI to connect the blog database");
  if (!globalDatabase.blogMongo) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      waitQueueTimeoutMS: 10000,
    });
    globalDatabase.blogMongo = client.connect().catch(async () => {
      globalDatabase.blogMongo = undefined;
      await client.close();
      throw new Error(
        "Blog database connection failed. Check Atlas credentials and network access.",
      );
    });
  }
  const client = await globalDatabase.blogMongo;
  return client.db(process.env.MONGODB_DB || "portfolio");
}
export async function blogCollection() {
  return (await blogDatabase()).collection("posts");
}
