const mongoose = require("mongoose");

const TechPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceTask" }],
  createdAt: { type: Date, default: Date.now },
});

const TechPerson = mongoose.model("TechPerson", TechPersonSchema);

module.exports = {
  TechPerson
};
