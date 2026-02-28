const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  // Use Google Public DNS to resolve SRV records (some ISPs block SRV)
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    console.error("  Check: 1) Atlas Network Access allows your IP  2) Credentials are correct  3) Cluster is active");
    process.exit(1);
  }
};

module.exports = connectDB;
