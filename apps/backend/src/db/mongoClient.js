const mongoose = require('mongoose');
require('dotenv').config();

// Disable buffering so Mongoose fails fast instead of hanging when disconnected
mongoose.set('bufferCommands', false);

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ss_management_db';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    console.warn(`Could not connect to MongoDB (${err.message}). Using fallback memory store.`);
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  getIsConnected,
  mongoose
};
