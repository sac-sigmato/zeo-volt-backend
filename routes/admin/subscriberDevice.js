const express = require("express");
const verifyToken = require("../../middleware/authMiddleware");
const {
  subscribeDevice,
  uploadDocument,
} = require("../../controllers/admin/subscribedDevices");
const router = express.Router();

router.post("/admin/subscribe/device", verifyToken, subscribeDevice);
router.post("/admin/subscribe/device/upload-document", verifyToken, uploadDocument);
module.exports = router;
