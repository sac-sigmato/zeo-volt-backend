const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../../models/admin/superAdmin");

exports.signUpSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ 1. Check if a Super Admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne();
    if (existingSuperAdmin) {
      return res.status(400).json({
        message: "A Super Admin already exists. No new signups allowed.",
      });
    }

    // ✅ 2. Check if this email is already registered
    const emailExists = await SuperAdmin.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "This email is already registered.",
      });
    }

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create and save new Super Admin
    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newSuperAdmin.save();

    // ✅ 5. Generate JWT token
    const token = jwt.sign(
      { id: newSuperAdmin._id, userType: newSuperAdmin.userRole },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // ✅ 6. Respond with token and user details
    res.status(201).json({
      message: "Super Admin created successfully!",
      token,
      userDetails: {
        _id: newSuperAdmin._id,
        name: newSuperAdmin.name,
        email: newSuperAdmin.email,
        userRole: newSuperAdmin.userRole,
      },
    });
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).json({
      message: "Error creating Super Admin",
      error: error.message || error,
    });
  }
};

exports.loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // 2. Check if user exists
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: superAdmin._id, userType: superAdmin.userRole },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // 5. Respond with user data and token
    res.status(200).json({
      message: "Login successful!",
      token,
      userDetails: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        userRole: superAdmin.userRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed. Please try again.",
      error: error.message || error,
    });
  }
};

exports.getSuperAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const superAdmin = await SuperAdmin.findById(id).select("-password"); // exclude password
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found." });
    }

    res.status(200).json({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      userRole: superAdmin.userRole,
      createdAt: superAdmin.createdAt,
    });
  } catch (error) {
    console.error("Error fetching Super Admin:", error);
    res.status(500).json({
      message: "Failed to fetch Super Admin",
      error: error.message || error,
    });
  }
};
