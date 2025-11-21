// const mongoose = require('mongoose');

// const connectDb = async () => {
//     await mongoose.connect(process.env.CLUSTER)
// }

// module.exports = connectDb;

const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDb = async () => {
  if (isConnected) {
    console.log("✅ MongoDB is already connected.");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.CLUSTER);
    isConnected = connection.connections[0].readyState === 1;
    console.log("🚀 MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
