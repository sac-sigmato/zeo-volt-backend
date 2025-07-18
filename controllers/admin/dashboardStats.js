// controllers/admin/dashboard.controller.js
const Subscriber = require("../../models/Subscriber");
const Ticket = require("../../models/ticketModel");
const Device = require("../../models/admin/device");

exports.getDashboardStats = async (req, res) => {
  try {
    const [subscriberCount, deviceCount, ticketCount, openTickets] = await Promise.all([
      Subscriber.countDocuments(),
      Device.countDocuments(),
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
    ]);

    res.status(200).json({
      subscriberCount,
      deviceCount,
      ticketCount,
      openTicketCount: openTickets,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
