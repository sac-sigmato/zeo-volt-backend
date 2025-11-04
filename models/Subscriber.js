const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  description: { type: String, required: false },
  month: { type: String, required: true },
  year: { type: String, required: true },
  powerGenerated: { type: Number, required: true }, // in kW
  points: { type: Number, required: true },
});

const subscribedDeviceSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  documentUrl: {
    type: String,
    default: "",
  },
});

const subscriberSchema = new mongoose.Schema(
  {
    subId: {
      type: String,
      unique: true,
      required: false,
    },
    name: { type: String, required: false },
    phone: { type: String, required: false, unique: true },
    email: { type: String, required: false, unique: true },
    city: { type: String, required: false },
    area: { type: String, required: false },
    pincode: { type: String, required: false },
    fullAddress: { type: String, required: false },
    referralCode: {
      type: String,
      unique: true,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "partner", "admin"],
      default: "customer",
    },
    sunSmiles: { type: Number },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isKYC:{
      type: Boolean,
      default: false,
    },
    subscribedDevices: [subscribedDeviceSchema],
    points: [pointSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
