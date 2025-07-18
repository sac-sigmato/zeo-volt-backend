const mongoose = require("mongoose");

const subAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // Email is required and must be unique
    password: { type: String, required: true },
    userRole: {
      type: String,
      enum: ["subAdmin"],
      default: "subAdmin",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubAdmin", subAdminSchema);
