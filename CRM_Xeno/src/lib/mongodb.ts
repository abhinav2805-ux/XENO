/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// --- MongoClient for NextAuth Adapter ---
const uri = process.env.MONGODB_URI as string;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In dev, use a global variable so the value is preserved across module reloads
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// --- Mongoose dbConnect for Models ---
export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
}