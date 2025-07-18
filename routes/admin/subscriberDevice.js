const express = require("express");
const verifyToken = require("../../middleware/authMiddleware");
const {
  subscribeDevice,
} = require("../../controllers/admin/subscribedDevices");
const router = express.Router();

router.post("/admin/subscribe/device", verifyToken, subscribeDevice);

module.exports = router;
