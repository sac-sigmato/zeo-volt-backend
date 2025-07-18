const express = require("express");
const { superSubAdminsloginController } = require("../../controllers/admin/superSubAdminsLogin");

const router = express.Router();

// POST /api/superadmin/signup
router.post("/super/sub/admin/login", superSubAdminsloginController);

module.exports = router;
