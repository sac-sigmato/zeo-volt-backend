const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// OTP & User
router.post("/generate-otp", authController.generateOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/update-profile/:userId", authController.updateUserDetails);
router.post("/forgot-password", authController.forgotPassword);
router.get("/get-user", authController.getUserDetails);
// get tech persons list
router.get("/tech-persons", authController.getTechPersonsList);
router.post("/submit-referral/:userId", authController.submitReferral);
router.post("/add-maintenance-task", authController.addMaintenanceTask);
router.post("/create-maintenance-plan", authController.createMaintenancePlanAPI);
router.get("/get-maintenance-plan/:subscriber/:device", authController.getMaintenancePlanAPI);
router.post("/add-tech-person", authController.addTechPerson);
router.put("/update-maintenance-task/:taskId", authController.updateTaskStatus);

router.get("/tech-person/:id/tasks", authController.getTasksForTechPerson);

// // Project Info
// router.get("/user/:userId/projects", authController.getUserProjects);
 
// // Documents
// router.get("/user/:userId/documents", authController.getUserDocuments);

// // Loyalty Points
// router.get("/user/:userId/loyalty", authController.getLoyaltyPoints);

// // Referrals
router.post("/user/:userId/referrals", authController.submitReferral);
router.get("/user/:userId/referrals", authController.getReferrals);
router.get("/referrals", authController.getAllReferrals);
//
// Get subscriber device using userId
router.get("/user/:userId/devices", authController.getFirstSubscribedDevice);

module.exports = router;