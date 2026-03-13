const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in environment variables.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(mongoUri, {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 15000
      });
    }

    const conn = await cached.promise;
    cached.conn = conn;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
