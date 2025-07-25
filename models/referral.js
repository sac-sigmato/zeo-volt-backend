// write referral model
const mongoose = require("mongoose");
const referralSchema = new mongoose.Schema({
        referredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subscriber",
          required: true
        },
        name: {
          type: String,
          required: true
        },
        phone: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending"
        }
      },
      { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);