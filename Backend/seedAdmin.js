const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore",
);

// User Schema (same as in models)
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@bookstore.com" });

    if (existingAdmin) {
      // Update to admin role if not already
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ Admin user already exists. Role updated to admin.");
      console.log("\n📧 Email: admin@bookstore.com");
      console.log("🔑 Password: Admin@123");
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);

      const admin = await User.create({
        fullName: "Admin User",
        email: "admin@bookstore.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("\n========================================");
      console.log("📧 Email: admin@bookstore.com");
      console.log("🔑 Password: Admin@123");
      console.log("========================================");
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
