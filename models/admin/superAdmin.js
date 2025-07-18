const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: "SuperAdmin",
      enum: ["SuperAdmin"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "superadmins",
  }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
