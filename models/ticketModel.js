// models/admin/ticket.model.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    issueType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
