const SubAdmin = require("../models/admin/subAdmin");
const Role = require("../models/admin/role");
const Permission = require("../models/admin/permission");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { id, userType } = req.user;

      console.log(`🔐 Checking permission: '${requiredPermission}'`);
      console.log(`👤 User ID: ${id}`);
      console.log(`🔰 User Role: ${userType}`);

      // ✅ Skip permission check for SuperAdmin
      if (userType === "SuperAdmin") {
        console.log("✅ SuperAdmin detected, skipping permission check.");
        return next();
      }

      // 🔍 Fetch user and their role + permissions
      const user = await SubAdmin.findById(id).populate({
        path: "role",
        populate: { path: "permissions" },
      });

      if (!user) {
        console.log("❌ SubAdmin not found in database.");
        return res.status(403).json({ message: "User not found" });
      }

      if (!user.role) {
        console.log("❌ User has no role assigned.");
        return res.status(403).json({ message: "Role not assigned" });
      }

      if (!user.role.permissions || user.role.permissions.length === 0) {
        console.log("❌ User's role has no permissions.");
        return res.status(403).json({ message: "No permissions assigned" });
      }

      const hasPermission = user.role.permissions.some(
        (perm) => perm.name === requiredPermission
      );

      console.log(
        `🔎 Permissions assigned: ${user.role.permissions.map((p) => p.name).join(", ")}`
      );

      if (!hasPermission) {
        console.log(`❌ Permission '${requiredPermission}' not found in user's role.`);
        return res.status(403).json({ message: "Access denied: Permission missing" });
      }

      console.log("✅ Permission granted.");
      next();
    } catch (error) {
      console.error("🔥 Permission check failed:", error);
      return res.status(500).json({ message: "Server error during permission check" });
    }
  };
};

module.exports = checkPermission;
