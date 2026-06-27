import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connect = (collection: string) => {
  const database = process.env.DB_NAME as string;
  return client.db(database).collection(collection);
};
