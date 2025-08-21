const express = require("express");
const { addDevice, getAllDevices, getDeviceById } = require("../../controllers/admin/deviceController");
const verifyToken = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/admin/add/device", verifyToken,addDevice);
router.post("/get/all/devices", verifyToken,getAllDevices);
router.get("/get/device/by/:id",getDeviceById); // ✅ Add this line

module.exports = router;
