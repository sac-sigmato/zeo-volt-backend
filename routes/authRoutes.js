const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// OTP & User
router.post("/generate-otp", authController.generateOTP);
router.post("/verify-otp", authController.verifyOTP);
router.put("/user/:userId", authController.updateUserDetails);
router.get("/get-user", authController.getUserDetails);
router.post("/submit-referral/:userId", authController.submitReferral);
router.post("/add-maintenance-task", authController.addMaintenanceTask);
router.post("/add-tech-person", authController.addTechPerson);
router.put("/update-maintenance-task/:taskId", authController.updateTaskStatus);

// // Project Info
// router.get("/user/:userId/projects", authController.getUserProjects);
 
// // Documents
// router.get("/user/:userId/documents", authController.getUserDocuments);

// // Loyalty Points
// router.get("/user/:userId/loyalty", authController.getLoyaltyPoints);

// // Referrals
// router.post("/user/:userId/referrals", authController.submitReferral);
// router.get("/user/:userId/referrals", authController.getReferrals);

module.exports = router;