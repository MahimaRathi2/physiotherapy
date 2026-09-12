const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {

}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");

    // Auto-seed default Admin account if none exists
    const User = require("../models/User");
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Clinic Administrator",
        email: "admin@satyaphyseo.com",
        phone: "+91 98110 24567",
        password: "adminpassword123",
        role: "admin"
      });
      console.log("Default Admin Account created: admin@satyaphyseo.com / adminpassword123");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;