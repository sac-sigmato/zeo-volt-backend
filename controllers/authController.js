const client = require("../twilioClient"); // Adjust path as needed
const Subscriber = require("../models/Subscriber");
const Referral = require("../models/referral");
// Generate OTP via Twilio
exports.generateOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    console.log("Received OTP request for:", phone);

    // 1️⃣ Check if the user exists
    const existingUser = await Subscriber.findOne({ phone });

    if (!existingUser) {
      return res
        .status(404)
        .json({ error: "User not found. Please contact admin." });
    }

    // 2️⃣ Call Twilio
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });

    console.log("Twilio generate response:", verification);

    // 3️⃣ Return Twilio response
    return res.json({
      message: "OTP sent successfully",
      sid: verification.sid,
      status: verification.status, // should be "pending"
      to: verification.to,
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    let { phone, otp } = req.body;
    console.log("Verifying OTP for:", phone, "with code:", otp);

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    // ✅ Ensure E.164 format (India example)
    if (!phone.startsWith("+")) {
      phone = "+91" + phone;
    }

    // 🔹 Twilio OTP Verification
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });

    console.log("Twilio verification response:", verificationCheck);

    if (verificationCheck.status === "approved") {
      // Find or create user
      let user = await Subscriber.findOne({ phone });
      if (!user) {
        user = new Subscriber({ phone });
        await user.save();
      }

      return res.json({
        message: "OTP verified successfully",
        userId: user._id,
        userDetails: user,
      });
    }

    return res.status(400).json({ error: "Invalid or expired OTP" });
  } catch (error) {
    console.error("Twilio OTP verification error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};


const { Types } = require("mongoose");

exports.updateUserDetails = async (req, res) => {
  try {
    const userIdRaw = (req.params.userId || "").trim();
    console.log("Updating user details for ID:", userIdRaw);

    if (!Types.ObjectId.isValid(userIdRaw)) {
      return res.status(400).json({
        error: "Invalid userId (must be a 24-character hex ObjectId)",
        received: userIdRaw,
      });
    }
    const userId = new Types.ObjectId(userIdRaw);

    const user = await Subscriber.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    console.log("Current user data:", user);
    
    // --- only update provided fields (keeps empty string/false/0 valid) ---
    const up = req.body || {};
    if (up.subId !== undefined) user.subId = up.subId;
    if (up.name !== undefined) user.name = up.name;
    if (up.phone !== undefined) user.phone = up.phone;
    if (up.email !== undefined) user.email = up.email;
    if (up.city !== undefined) user.city = up.city;
    if (up.area !== undefined) user.area = up.area;
    if (up.pincode !== undefined) user.pincode = up.pincode;
    if (up.fullAddress !== undefined) user.fullAddress = up.fullAddress;
    if (up.referralCode !== undefined) user.referralCode = up.referralCode;
    if (up.isVerified !== undefined) user.isVerified = up.isVerified;
    if (up.role !== undefined) user.role = up.role;
    if (up.sunSmiles !== undefined) user.sunSmiles = up.sunSmiles;
    if (up.status !== undefined) user.status = up.status;
    if (
      up.subscribedDevices !== undefined &&
      Array.isArray(up.subscribedDevices)
    ) {
      user.subscribedDevices = up.subscribedDevices;
    }
    if (up.points !== undefined && Array.isArray(up.points)) {
      user.points = up.points;
    }

    await user.save();
    res.json({ message: "Subscriber details updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user details" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Simulate sending a password reset email
    console.log(`Sending password reset email to ${email}`);

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
};

//Give get user api return user data I have only one as of now for testing
exports.getUserDetails = async (req, res) => {
  try {
    const user = await Subscriber.find();

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

// controller to submit referral by userId
exports.submitReferral = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, email } = req.body;

    const referral = new Referral({
      referredBy: userId,
      name,
      phone,
      email,
      status: "Pending",
    });

    await referral.save();
    res.json({ message: "Referral submitted successfully", referral });
  } catch (error) {
    console.error("Submit referral error:", error);
    res.status(500).json({ error: "Failed to submit referral" });
  }
};

// controller to get referrals by userId
exports.getReferrals = async (req, res) => {
  try {
    const { userId } = req.params;
    const referrals = await Referral.find({ referredBy: userId });
    res.json({ referrals });
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
};
const mongoose = require("mongoose");

// create a new controller for getAllReferrals
exports.getAllReferrals = async (req, res) => {
  try {
    // Fetch all referrals
    const referrals = await Referral.find().lean();
    console.log("📋 Raw referrals:", JSON.stringify(referrals, null, 2));

    // Get all unique referredBy userIds (they are already ObjectIds)
    const rawUserIds = referrals.map((ref) => ref.referredBy).filter(Boolean);
    console.log("🔍 Raw referredBy values:", rawUserIds);

    // Remove duplicates - no need to convert to ObjectId since they already are
    const userIds = [...new Set(rawUserIds)];
    console.log("🆔 Unique User IDs:", userIds);

    // Fetch all subscribers in one go
    const subscribers = await Subscriber.find({ _id: { $in: userIds } })
      .select("name _id")
      .lean();
    console.log("👥 Found subscribers:", subscribers);

    // Map userId to name (convert both to string for consistent comparison)
    const userIdToName = {};
    subscribers.forEach((sub) => {
      userIdToName[sub._id.toString()] = sub.name;
    });
    console.log("🗺️ User ID to Name mapping:", userIdToName);

    // Attach username to each referral
    const referralsWithUsernames = referrals.map((ref) => {
      const referredById = ref.referredBy;
      return {
        ...ref,
        referredByName: referredById
          ? userIdToName[referredById.toString()] || null
          : null,
        referredById: referredById ? referredById.toString() : null,
      };
    });

    console.log(
      "✅ Final referrals with usernames:",
      JSON.stringify(referralsWithUsernames, null, 2)
    );

    res.json({
      success: true,
      referrals: referralsWithUsernames,
    });
  } catch (error) {
    console.error("❌ Get all referrals error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch all referrals",
      message: error.message,
    });
  }
};

// create a new controller for add maintenance task
const {MaintenanceTask} = require("../models/MaintenanceTask");
exports.addMaintenanceTask = async (req, res) => {
  try {
    const { title, description, assignedTo, subscriberId } = req.body;
    if (!subscriberId) {
      return res.status(400).json({ error: "Subscriber ID is required" });
    }
    const newTask = new MaintenanceTask({
      title,
      description,
      assignedTo,
      subscriber: subscriberId,
    });
    await newTask.save();
    res
      .status(201)
      .json({
        message: "Maintenance task created successfully",
        task: newTask,
      });
  } catch (error) {
    console.error("Add maintenance task error:", error);
    res.status(500).json({ error: "Failed to create maintenance task" });
  }
};

const createMaintenancePlan = async (userId, deviceId) => {
  const totalServices = 8;
  const services = [];

  const now = new Date();

  for (let i = 0; i < totalServices; i++) {
    services.push({
      title: "System Inspection",
      description: "Comprehensive check system wiring",
      subscriber: userId,
      device: deviceId,
      serviceIndex: i + 1,
      year: Math.floor(i / 2) + 1, // 2 services per year
      scheduledDate: new Date(
        new Date(now).setMonth(now.getMonth() + i * 6) // every 6 months
      ),
      status: "upcoming",
    });
  }

  return await MaintenanceTask.insertMany(services);
};

// API endpoint
exports.createMaintenancePlanAPI = async (req, res) => {
  try {
    const { userId, deviceId } = req.body;

    const result = await createMaintenancePlan(userId, deviceId);

    res.status(201).json({
      message: "Maintenance plan created",
      totalServices: result.length,
      services: result,
    });
  } catch (err) {
    console.error("Error creating maintenance plan:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMaintenancePlanAPI = async (req, res) => {
   try {
     const { subscriber, device } = req.params;
      console.log("Fetching maintenance plan for:", { subscriber, device });

     if (!subscriber || !device) {
       return res
         .status(400)
         .json({ message: "subscriber and device are required" });
     }

     // Fetch all matching maintenance records
     const records = await MaintenanceTask.find({
       subscriber,
       device,
     }).sort({ createdAt: -1 }); // optional: latest first

     if (!records || records.length === 0) {
       return res.status(404).json({ message: "No maintenance records found" });
     }

     res.status(200).json({
       success: true,
       count: records.length,
       data: records,
     });
   } catch (error) {
     console.error("Error fetching maintenance:", error);
     res.status(500).json({ message: "Server Error", error: error.message });
   }
};

const  Device  = require("../models/admin/device"); // adjust path

// Get first subscribed device details directly from userId
exports.getFirstSubscribedDevice = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching first subscribed device for user:", userId);

    // Find user and populate subscribedDevices
    const user = await Subscriber.findById(userId).populate(
      "subscribedDevices.device"
    );

    if (
      !user ||
      !user.subscribedDevices ||
      user.subscribedDevices.length === 0
    ) {
      return res.status(404).json({ message: "No subscribed devices found." });
    }

    // Get the first deviceId from subscribedDevices array
    const firstDeviceId = user.subscribedDevices[0].device;

    // Fetch full device details from Device collection
    const device = await Device.findById(firstDeviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Send device details
    res.status(200).json({
      message: "First subscribed device details fetched successfully",
      device,
    });
  } catch (err) {
    console.error("Error fetching first subscribed device:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//create a new cpntroller for add tech person
const  TechPerson  = require("../models/TechPerson");

exports.addTechPerson = async (req, res) => {
  try {
    console.log("Adding tech person:", req.body);
    
    const { name, phone, email } = req.body;
    const newTechPerson = new TechPerson({
      name,
      phone,
      email,
    });
    await newTechPerson.save();
    res
      .status(201)
      .json({
        message: "Tech person added successfully",
        techPerson: newTechPerson,
      });
  } catch (error) {
    console.error("Add tech person error:", error);
    res.status(500).json({ error: "Failed to add tech person" });
  }
};

// Get tech persons list
exports.getTechPersonsList = async (req, res) => {
  try {
    const techPersons = await TechPerson.find();
    res.json({ techPersons });
  } catch (error) {
    console.error("Get tech persons error:", error);
    res.status(500).json({ error: "Failed to fetch tech persons" });
  }
};

//create a new controller for techperson to update task status and checklist can upload images
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, checklist, images, subscriber } = req.body;

    const update = {
      status,
      checklist,
      images,
      subscriber,
      updatedAt: new Date(),
    };

    const updatedTask = await MaintenanceTask.findByIdAndUpdate(
      taskId,
      { $push: { updates: update } },
      { new: true }
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

exports.getTasksForTechPerson = async (req, res) => {
  try {
    const techPersonId = req.params.id;

    // Fetch tech person details
    const techPerson = await TechPerson.findById(techPersonId).lean();
    if (!techPerson) {
      return res.status(404).json({ error: "Tech person not found" });
    }

    // Fetch tasks where assignedTo matches techPersonId, include status
    const tasks = await MaintenanceTask.find({ assignedTo: techPersonId })
      .select("title description status createdAt")
      .lean();
    console.log("Fetched tasks for tech person:", tasks);

    res.status(200).json({
      techPerson: {
        ...techPerson,
        tasks,
      },
    });
  } catch (error) {
    console.error("Error fetching tech person tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
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

