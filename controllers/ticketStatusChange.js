const Ticket = require("../models/ticketModel");

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      message: "Ticket status updated successfully.",
      ticket,
    });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
