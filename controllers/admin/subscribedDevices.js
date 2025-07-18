const Subscriber = require("../../models/Subscriber");
const Device = require("../../models/admin/device");

exports.subscribeDevice = async (req, res) => {
  const { subscriberId, deviceId } = req.body;

  try {
    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    // Check if device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // Check if device is already subscribed
    const alreadySubscribed = subscriber.subscribedDevices?.some(
      (d) => d.toString() === deviceId
    );

    if (alreadySubscribed) {
      return res.status(409).json({ message: "Device is already subscribed to this subscriber." });
    }

    // Add the device to the subscriber's subscribedDevices array
    subscriber.subscribedDevices.push(deviceId);
    await subscriber.save();

    res.status(200).json({
      message: "Device successfully subscribed to subscriber.",
      subscriber,
    });
  } catch (err) {
    console.error("Subscription failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
