const mongoose = require("mongoose");

const ChecklistItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

const TaskUpdateSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  checklist: [ChecklistItemSchema],
  images: [{ type: String }], // Store image URLs or file paths
  updatedAt: { type: Date, default: Date.now },
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
});

const MaintenanceTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  // link to tech & subscriber
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "TechPerson" },
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },

  // predefined plan fields
  serviceIndex: Number, // e.g. 1 of 8
  year: Number, // e.g. 1, 2, 3
  scheduledDate: Date,
  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "pending"],
    default: "upcoming",
  },

  updates: [TaskUpdateSchema],
  createdAt: { type: Date, default: Date.now },
});

const MaintenanceTask = mongoose.model(
  "MaintenanceTask",
  MaintenanceTaskSchema
);

module.exports = { MaintenanceTask };
