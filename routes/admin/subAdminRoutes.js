const express = require("express");

const {
  createSubAdmin,
  getAllSubAdmins,
} = require("../../controllers/admin/subAdminController");
const {
  updateSubAdminStatus,
  getSubAdminById,
} = require("../../controllers/admin/edtSubAdminStatus");
const verifyToken = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission ");
const { updateSubAdminById, changeSubAdminPassword } = require("../../controllers/admin/subAdminprofile");
const router = express.Router();

router.post("/admin/subAdmin/add", verifyToken,checkPermission("can_add_subadmin"), createSubAdmin);
router.post("/admin/all/subadmins", verifyToken, getAllSubAdmins);
router.patch(
  "/admin/update/subadmin/status",
  verifyToken,checkPermission("can_edit_subadmin_status"),
  updateSubAdminStatus
);
router.get("/admin/subadmin/get/by/:id", verifyToken, getSubAdminById);
router.patch("/admin/subadmin/update/:id", verifyToken, updateSubAdminById);
router.patch("/admin/subadmin/change-password/:id", verifyToken, changeSubAdminPassword);


module.exports = router;
