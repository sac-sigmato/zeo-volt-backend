// routes/admin/ticket.routes.js
const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const {
  createTicket,
  getAllTickets,
  getAllTickets2,
} = require("../controllers/ticketController");
const { updateTicketStatus } = require("../controllers/ticketStatusChange");
const router = express.Router();


router.post("/create/ticket", createTicket);
router.get("/get/all/tickets/:userId", getAllTickets);
router.post("/get/all/tickets", getAllTickets2);
router.put("/update/ticket/:id", verifyToken, updateTicketStatus);

module.exports = router;
