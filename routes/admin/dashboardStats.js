// routes/dashboard.js
const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../../controllers/admin/dashboardStats");
const verifyToken = require("../../middleware/authMiddleware");

router.post("/admin/dashboard-stats", verifyToken, getDashboardStats);
module.exports = router;
