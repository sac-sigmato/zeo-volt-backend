const express = require('express');
const { signUpSuperAdmin, loginSuperAdmin, getSuperAdminById } = require('../../controllers/admin/superAdminContoller');
const verifyToken = require('../../middleware/authMiddleware');
const { changeSuperAdminPassword, updateSuperAdminById } = require('../../controllers/admin/superAminprofile');
const router = express.Router();

// POST /api/superadmin/signup
router.post('/superAdmin/signup', signUpSuperAdmin);
router.post('/superAdmin/login', loginSuperAdmin);
router.get("/superAdmin/get/by/:id", verifyToken,getSuperAdminById);
router.patch("/superAdmin/update/:id", verifyToken, updateSuperAdminById);
router.patch("/superAdmin/change-password/:id", verifyToken, changeSuperAdminPassword);


module.exports = router;
