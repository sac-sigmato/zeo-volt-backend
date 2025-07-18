const express = require("express");
const {
  addPermission,
  getAllPermissions,
} = require("../../controllers/admin/permissionController");
const router = express.Router();
const verifyToken = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission ");

router.post(
  "/admin/addPermission",
  verifyToken,checkPermission("can_add_permissons"),
  addPermission
);
router.get("/admin/getAllPermissions", verifyToken, getAllPermissions);

module.exports = router;
