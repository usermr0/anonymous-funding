// Load environment variables FIRST - before anything else
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load .env file from the correct path
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log('🔍 Dotenv loaded:', !result.error);
console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log('🔍 Using URI starting with:', uri ? uri.substring(0, 50) + '...' : 'UNDEFINED');

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 10000,
  tls: true,
  retryWrites: true,
  retryReads: true,
  family: 4 // Force IPv4
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error('❌ Please define MONGODB_URI environment variable');
}

let clientPromise: Promise<MongoClient>;

const connectWithRetry = () => {
  console.log('⏳ Attempting to connect to MongoDB...');
  const client = new MongoClient(uri, options);
  return client.connect()
    .then(client => {
      console.log('✅ MongoDB connected successfully');
      return client;
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectWithRetry();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connectWithRetry();
}

export default clientPromise;