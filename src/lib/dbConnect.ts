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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = (cname: string) => {
  return client.db(dbname).collection(cname);
};
