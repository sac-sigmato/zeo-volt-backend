require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/admin/superAdminRoutes");
const permissionRoutes = require("./routes/admin/permissionRoutes");
const roleRoutes = require("./routes/admin/roleRoutes");
const subAdminRoutes = require("./routes/admin/subAdminRoutes");
const superSubAdminsLoginRoutes = require("./routes/admin/superSubAdminsLoginRoutes");
const deviceRoutes = require("./routes/admin/deviceRoutes");
const subsciberDevice = require("./routes/admin/subscriberDevice");
const ticketRoutes = require("./routes/ticketRoutes");
const dashboardStats = require("./routes/admin/dashboardStats");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", subscriberRoutes);
app.use("/api", adminRoutes);
app.use("/api", permissionRoutes);
app.use("/api", roleRoutes);
app.use("/api", subAdminRoutes);
app.use("/api", superSubAdminsLoginRoutes);
app.use("/api", deviceRoutes);
app.use("/api", subsciberDevice);
app.use("/api", ticketRoutes);
app.use("/api", dashboardStats);
app.use("/api", authRoutes);
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));