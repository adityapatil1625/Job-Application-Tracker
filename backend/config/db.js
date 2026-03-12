const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in environment variables.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      tls: true,
      tlsAllowInvalidCertificates: false
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
