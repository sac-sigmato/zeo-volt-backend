const Device = require("../../models/admin/device");

// Generate next unique deviceId (e.g., device1, device2, etc.)
async function generateUniqueDeviceId() {
  let counter = 1;
  let unique = false;
  let deviceId;

  while (!unique) {
    deviceId = `device${counter}`;
    const exists = await Device.findOne({ deviceId });
    if (!exists) {
      unique = true;
    } else {
      counter++;
    }
  }

  return deviceId;
}

exports.addDevice = async (req, res) => {
  try {
    const { deviceName,deviceId, type, manufacturer, modelNumber, capacity, status, notes } = req.body;

    if (!deviceName || !type || !capacity || !status) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    // const deviceId = await generateUniqueDeviceId();

    const newDevice = new Device({
      deviceId,
      deviceName,
      type,
      manufacturer,
      modelNumber,
      capacity,
      status,
      notes,
    });

    await newDevice.save();

    res.status(201).json({ message: "Device added successfully", device: newDevice });
  } catch (err) {
    console.error("Error adding device:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const { search } = req.body;
    const query = {};

    if (search) {
      query.$or = [
        { deviceId: { $regex: search, $options: "i" } },
        { deviceName: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const devices = await Device.find(query).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (err) {
    console.error("Error fetching devices:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.status(200).json(device);
  } catch (err) {
    console.error("Error fetching device:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
