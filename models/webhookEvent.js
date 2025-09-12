const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
  {
    source: { type: String, default: "cronberry" }, // to identify CRM
    eventType: { type: String }, // if CRM provides an event name
    payload: { type: mongoose.Schema.Types.Mixed, required: true }, // store raw payload
    processed: { type: Boolean, default: false }, // if you need to process later
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);

module.exports = WebhookEvent;
