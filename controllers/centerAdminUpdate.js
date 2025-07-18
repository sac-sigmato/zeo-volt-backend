const User = require("../models/userModel");

exports.updateCenterAdmin = async (req, res) => {
    try {
      const { id, status, centerId } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const update = {};
  
      if (status === "Active" || status === "Inactive") {
        update.status = status;
      }
  
      if (centerId) {
        update.centerId = centerId;
      }
  
      const updated = await User.findByIdAndUpdate(id, update, { new: true });
  
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Center Admin updated", user: updated });
    } catch (err) {
      console.error("Error updating Center Admin:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  