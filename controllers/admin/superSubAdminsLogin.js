const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SuperAdmin = require("../../models/admin/superAdmin");
const SubAdmin = require("../../models/admin/subAdmin");

const superSubAdminsloginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check SuperAdmin first
    let user = await SuperAdmin.findOne({ email });
    let userType = "superadmin";

    if (!user) {
      // If not SuperAdmin, check SubAdmin
      user = await SubAdmin.findOne({ email }).populate("role");
      userType = "subadmin";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, userType: user.userRole },
        process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userDetails: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.userRole
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { superSubAdminsloginController };
