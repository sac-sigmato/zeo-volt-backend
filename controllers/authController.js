// const client = require("../utils/twilioClient"); // Adjust path as needed
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

    // ===============================
    // Twilio OTP sending is disabled
    // ===============================

    // const verification = await client.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verifications.create({ to: phone, channel: "sms" });

    // 2️⃣ Simulate OTP generation success
    res.json({
      message: "OTP (simulated) sent successfully",
      status: "pending",
    });
  } catch (error) {
    console.error("OTP generation error:", error);
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
        userDetails: user,
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
    console.log("Updating user details for ID:", userId);
    
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

