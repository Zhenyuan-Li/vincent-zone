import { MongoClient } from 'mongodb';

export const connectDatabase = async () => {
  const client = await MongoClient.connect(process.env.DB_URL);
  return client;
};

export const insertDocument = async (client, collection, document) => {
  const db = client.db();
  const results = await db.collection(collection).insertOne(document);
  return results;
};

export const fetchAllDocuments = async (client, collection, sort) => {
  const db = client.db();
  const document = await db.collection(collection).find().sort(sort).toArray();
  return document;
};

export const isInputValid = (email, name, text) => {
  if (
    !email.includes('@') ||
    !name ||
    name.trim() === '' ||
    !text ||
    text.trim() === ''
  ) {
    return false;
  } else {
    return true;
  }
};
