import { MongoClient, ServerApiVersion } from "mongodb";

export const collection = {
  PRODUCTS: "products",
  USERS: "users",
  CART: "cart",
  ORDER: "order",
} as const;

const uri: string | undefined = process.env.MONGO_URI;
const dbname: string | undefined = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!dbname) {
  throw new Error("DB_NAME is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// one-time index setup
let indexesInitialized = false;
const initIndexes = async () => {
  if (indexesInitialized) return;

  try {
    await client.connect();
    await client
      .db(dbname)
      .collection(collection.USERS)
      .createIndex({ email: 1 }, { unique: true });

    // অন্যান্য collection এর জন্যও index যোগ করতে পারেন
    // await client
    //   .db(dbname)
    //   .collection(collection.PRODUCTS)
    //   .createIndex({ id: 1 });

    indexesInitialized = true;
    console.log("Database indexes created successfully");
  } catch (error) {
    console.error("Failed to create indexes:", error);
  }
};
initIndexes().catch(console.error);

export const dbConnect = (cname: string) => {
  return client.db(dbname).collection(cname);
};
