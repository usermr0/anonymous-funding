import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 1, // Smaller pool for serverless
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 5000,
  tls: true,
  retryWrites: true,
  retryReads: true,
  family: 4
};

if (!uri) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// In serverless environments, we need to cache the connection
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, options);
    cached.promise = client.connect()
      .then(client => {
        console.log('✅ MongoDB connected successfully');
        return { client, db: client.db('donations') };
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Export a function that returns the db directly
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

export default connectToDatabase;