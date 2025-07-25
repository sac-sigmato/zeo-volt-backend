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
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "TechPerson" },
  updates: [TaskUpdateSchema],
  createdAt: { type: Date, default: Date.now },
});

const MaintenanceTask = mongoose.model(
  "MaintenanceTask",
  MaintenanceTaskSchema
);

module.exports = {
  MaintenanceTask,
};
