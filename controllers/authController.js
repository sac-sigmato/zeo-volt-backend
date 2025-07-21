// const client = require("../utils/twilioClient"); // Adjust path as needed
const Subscriber = require("../models/Subscriber");
// Generate OTP via Twilio
exports.generateOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    console.log("Received OTP request for:", phone);

    // ===============================
    // Twilio OTP sending is disabled
    // ===============================

    // const verification = await client.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verifications.create({ to: phone, channel: "sms" });

    // Simulate success response without Twilio
    res.json({
      message: "OTP (simulated) sent successfully",
      status: "pending", // could be "sent" or "pending"
    });
  } catch (error) {
    console.error("Twilio OTP generation error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    // ===============================
    // DEV MODE: OTP bypass logic
    // ===============================
    if (otp === "1234") {
      let user = await Subscriber.findOne({ phone });
      if (!user) {
        user = new Subscriber({ phone });
        await user.save();
      }

      return res.json({
        message: "OTP verified (bypass mode)",
        userId: user._id,
      });
    }

    // ===============================
    // Twilio OTP verification disabled
    // ===============================

    // const verificationCheck = await client.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verificationChecks.create({ to: phone, code: otp });

    // if (verificationCheck.status !== "approved") {
    //   return res.status(400).json({ error: "Invalid or expired OTP" });
    // }

    // Simulate fallback if not using Twilio
    return res
      .status(400)
      .json({ error: "Invalid OTP (dev mode only accepts 1234)" });
  } catch (error) {
    console.error("Twilio OTP verification error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};


exports.updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      subId,
      name,
      phone,
      email,
      city,
      area,
      pincode,
      fullAddress,
      referralCode,
      isVerified,
      role,
      sunSmiles,
      status,
      subscribedDevices,
      points,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Subscriber ID is required" });
    }

    const user = await Subscriber.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    // Update all fields if provided
    if (subId) user.subId = subId;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (city) user.city = city;
    if (area) user.area = area;
    if (pincode) user.pincode = pincode;
    if (fullAddress) user.fullAddress = fullAddress;
    if (referralCode) user.referralCode = referralCode;
    if (typeof isVerified === "boolean") user.isVerified = isVerified;
    if (role) user.role = role;
    if (typeof sunSmiles === "number") user.sunSmiles = sunSmiles;
    if (status) user.status = status;
    if (Array.isArray(subscribedDevices))
      user.subscribedDevices = subscribedDevices;
    if (Array.isArray(points)) user.points = points;

    await user.save();

    res.json({
      message: "Subscriber details updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user details" });
  }
};


//Give get user api return user data I have only one as of now for testing
exports.getUserDetails = async (req, res) => {
  console.log("here");
  
  try {
    const user = await Subscriber.find();
    console.log(user);

    
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

// const Project = require("../models/project.model");

// exports.getUserProjects = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const projects = await Project.find({ user: userId });
//     res.json({ projects });
//   } catch (error) {
//     console.error("Get projects error:", error);
//     res.status(500).json({ error: "Failed to fetch projects" });
//   }
// };
// const Document = require("../models/document.model");

// exports.getUserDocuments = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const documents = await Document.find({ user: userId });
//     res.json({ documents });
//   } catch (error) {
//     console.error("Get documents error:", error);
//     res.status(500).json({ error: "Failed to fetch documents" });
//   }
// };
// const Loyalty = require("../models/loyalty.model");

// exports.getLoyaltyPoints = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const points = await Loyalty.findOne({ user: userId });
//     res.json({ points });
//   } catch (error) {
//     console.error("Get loyalty error:", error);
//     res.status(500).json({ error: "Failed to fetch loyalty points" });
//   }
// };
// const Referral = require("../models/referral.model");

// exports.submitReferral = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, phone, email } = req.body;

//     const referral = new Referral({
//       referredBy: userId,
//       name,
//       phone,
//       email,
//       status: "Pending",
//     });

//     await referral.save();
//     res.json({ message: "Referral submitted successfully", referral });
//   } catch (error) {
//     console.error("Submit referral error:", error);
//     res.status(500).json({ error: "Failed to submit referral" });
//   }
// };
// exports.getReferrals = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const referrals = await Referral.find({ referredBy: userId });
//     res.json({ referrals });
//   } catch (error) {
//     console.error("Get referrals error:", error);
//     res.status(500).json({ error: "Failed to fetch referrals" });
//   }
// };
