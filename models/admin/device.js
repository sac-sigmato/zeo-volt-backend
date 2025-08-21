const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      default: "",
    },
    modelNumber: {
      type: String,
      default: "",
    },
    capacity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
      default: "Inactive",
    },
    notes: {
      type: String,
      default: "",
    },

    // -------------------------
    // New fields from dashboard
    // -------------------------

    // Device Details
    energyGeneratedToday: { type: Number, default: 24.5 }, // kWh
    currentPower: { type: Number, default: 3.8 }, // kW
    peakPowerToday: { type: Number, default: 5.2 }, // kW

    // System Details
    installationDate: { type: Date, default: new Date("2023-06-15") },
    systemSize: { type: Number, default: 7.5 }, // kW
    panelType: { type: String, default: "SunPower Maxeon 5" },
    numberOfPanels: { type: Number, default: 24 },
    inverterType: { type: String, default: "SolarEdge SE7600H" },
    batteryStorage: {
      type: {
        name: { type: String, default: "Tesla Powerwall" },
        capacity: { type: Number, default: 13.5 }, // kWh
      },
      default: {},
    },

    // Energy Savings
    savingsThisMonth: { type: Number, default: 246.8 }, // Rs
    savingsPercentage: { type: Number, default: 82 }, // %
    totalEnergyGenerated: { type: Number, default: 12450 }, // kWh
    co2EmissionsAvoided: { type: Number, default: 8.8 }, // tons
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", deviceSchema);
