const Permission = require("../../models/admin/permission");

exports.addPermission = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Permission name is required" });
    }

    const exists = await Permission.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const permission = await Permission.create({ name, description, status });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ createdAt: -1 });
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};