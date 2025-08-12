const Subscriber = require("../../models/Subscriber");
const Device = require("../../models/admin/device");

exports.subscribeDevice = async (req, res) => {
  const { subscriberId, deviceId, documentUrl } = req.body;

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
      (d) => d.device?.toString() === deviceId
    );

    if (alreadySubscribed) {
      return res
        .status(409)
        .json({ message: "Device is already subscribed to this subscriber." });
    }

    // Add the device to the subscriber's subscribedDevices array
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      {
        $push: {
          subscribedDevices: {
            device: deviceId,
            documentUrl: "", // This should work with the modified schema
          },
        },
      },
      { new: true }
    ).populate("subscribedDevices.device");

    res.status(200).json({
      message: "Device successfully subscribed to subscriber.",
      subscriber: updatedSubscriber,
    });
  } catch (err) {
    console.error("Subscription failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const multer = require("multer");
const supabase = require("../../supabase");
// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});
const saveFileToStorage = async (file) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${timestamp}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("ai-photobooth-swap") // Replace with your bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("ai-photobooth-swap")
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
// In your backend API

exports.uploadDocument = [
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { subscriberId, deviceId } = req.body;

      if (!subscriberId || !deviceId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Process the file (save to storage, get URL)
      const documentUrl = await saveFileToStorage(req.file);

      // Update subscriber's documentUrl for this device
      const updatedSubscriber = await Subscriber.findOneAndUpdate(
        {
          _id: subscriberId,
          "subscribedDevices.device": deviceId,
        },
        {
          $set: { "subscribedDevices.$.documentUrl": documentUrl },
        },
        { new: true }
      ).populate("subscribedDevices.device");

      if (!updatedSubscriber) {
        return res
          .status(404)
          .json({ message: "Subscriber or device not found" });
      }

      res.status(200).json({
        message: "Document uploaded successfully",
        subscriber: updatedSubscriber,
      });
    } catch (err) {
      console.error("Document upload error:", err);

      let errorMessage = "Internal server error";
      let statusCode = 500;

      if (err.message.includes("Only PDF files")) {
        errorMessage = err.message;
        statusCode = 400;
      } else if (err.message.includes("file size")) {
        errorMessage = "File size exceeds 5MB limit";
        statusCode = 400;
      }

      res.status(statusCode).json({
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
];