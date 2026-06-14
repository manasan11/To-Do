const mongoose = require('mongoose');
const app = require('../server/app');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = conn;
    console.log('MongoDB connected (serverless)');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
