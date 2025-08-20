// routes/admin/ticket.routes.js
const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const { createTicket, getAllTickets } = require("../controllers/ticketController");
const { updateTicketStatus } = require("../controllers/ticketStatusChange");
const router = express.Router();


router.post("/create/ticket", createTicket);
router.post("/get/all/tickets", verifyToken, getAllTickets);
router.put("/update/ticket/:id", verifyToken, updateTicketStatus);

module.exports = router;
