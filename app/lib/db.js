import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

/**
 * In Mongoose 7, strictQuery is enabled by default. If you
 * want to disable it (to avoid warnings), uncomment the line below.
 */
// mongoose.set('strictQuery', false);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  // If already connected, return the cached connection
  if (cached.conn) {
    // console.log('[MongoDB] Using existing connection');
    return cached.conn;
  }

  // If a connection promise doesn't exist, create it
  if (!cached.promise) {
    // Recommended Mongoose options
    const opts = {
      bufferCommands: false,
      // useNewUrlParser: true, // (No longer needed in Mongoose 7+)
      // useUnifiedTopology: true, // (No longer needed in Mongoose 7+)
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // console.log('[MongoDB] New connection established');
      return mongoose;
    }).catch((err) => {
      console.error('[MongoDB] Connection failed:', err);
      throw err;
    });
  }

  // Wait for the promise to resolve
  cached.conn = await cached.promise;
  return cached.conn;
}
