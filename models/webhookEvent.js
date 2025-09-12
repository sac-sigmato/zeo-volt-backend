const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
  {
    source: {
      type: String, // optional: to identify the provider (e.g., "crobary")
      required: false,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // allows any JSON structure
      required: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false } // ensures extra fields in payload don’t break schema
);

module.exports = mongoose.model("WebhookEvent", webhookEventSchema);
