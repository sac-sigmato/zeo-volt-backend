const bcrypt = require("bcryptjs");
const SubAdmin = require("../../models/admin/subAdmin");


exports.createSubAdmin = async (req, res) => {
  console.log("req body", req.body);
  try {
    const { name, email, password, roleId, status } = req.body;

    // Check if email already exists
    const existing = await SubAdmin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSubAdmin = new SubAdmin({
      name,
      email,
      password: hashedPassword,
      role: roleId,               // ✅ Map roleId to role
      isActive: status === "Active", // ✅ Convert "Active"/"Inactive" to boolean
    });

    await newSubAdmin.save();

    return res.status(201).json({
      message: "Sub-admin created successfully",
      user: newSubAdmin,
    });
  } catch (err) {
    console.error("Error creating subadmin:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllSubAdmins = async (req, res) => {
  try {
    const { search = "", status } = req.body;

    // Build filter object
    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), "i"); // case-insensitive
      filter.$or = [{ name: regex }, { email: regex }];
    }

    if (status === "Active" || status === "Inactive") {
      filter.isActive = status === "Active";
    }

    const subAdmins = await SubAdmin.find(filter)
      .populate("role", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(subAdmins);
  } catch (err) {
    console.error("Error fetching sub-admins:", err);
    res.status(500).json({ message: "Server error" });
  }
};
