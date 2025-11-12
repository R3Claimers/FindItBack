const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Note: useNewUrlParser and useUnifiedTopology are deprecated and no longer needed
    // in MongoDB Driver v4.0.0+. They are default behavior now.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
