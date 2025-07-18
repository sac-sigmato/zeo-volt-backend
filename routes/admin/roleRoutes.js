const express = require("express");

const {
  addRole,
  getAllRoles,
  updateRolePermissions,
  getSubAdminRole,
  getCenterAdminRole,
} = require("../../controllers/admin/roleController");
const verifyToken = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission ");
const router = express.Router();

router.post(
  "/admin/addRole",
  verifyToken,
  checkPermission("can_add_role"),
  addRole
);
router.get("/admin/getAllRoles", verifyToken, getAllRoles);
router.put("/admin/updateRole/:roleId", verifyToken,checkPermission("can_edit_role"), updateRolePermissions);
router.get("/admin/get/role/by/SubAdmin", verifyToken, getSubAdminRole);
router.get("/admin/get/role/by/centerAdmin", verifyToken, getCenterAdminRole);

module.exports = router;
