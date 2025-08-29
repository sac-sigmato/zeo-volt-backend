// controllers/admin/ticket.controller.js
const mongoose = require("mongoose");
const Ticket = require("../models/ticketModel");
const Subscriber = require("../models/Subscriber");
const Device = require("../models/admin/device");

async function generateUniqueTicketId() {
  const lastTicket = await Ticket.findOne({})
    .sort({ createdAt: -1 })
    .select("ticketId");

  let nextNumber = 1;

  if (lastTicket && lastTicket.ticketId) {
    const match = lastTicket.ticketId.match(/ticket(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  let ticketId;
  let exists = true;

  // Ensure ticketId is unique
  while (exists) {
    ticketId = `ticket${nextNumber}`;
    const duplicate = await Ticket.findOne({ ticketId });
    if (!duplicate) {
      exists = false;
    } else {
      nextNumber++;
    }
  }

  return ticketId;
}

exports.createTicket = async (req, res) => {
  try {
    const { subscriberId, issueType, description, priority } = req.body;

    if (!subscriberId || !issueType?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate Subscriber
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    // Generate unique ticketId
    const ticketId = await generateUniqueTicketId();

    // Create Ticket
    const ticket = new Ticket({
      ticketId,
      subscriber: subscriberId,
      issueType,
      description,
      priority,
    });

    await ticket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getAllTickets = async (req, res) => {
//   try {
//     const { search = "" } = req.body;
//     const regex = new RegExp(search, "i");

//     const pipeline = [
//       {
//         $lookup: {
//           from: "subscribers",
//           localField: "subscriber",
//           foreignField: "_id",
//           as: "subscriber",
//         },
//       },
//       {
//         $unwind: "$subscriber",
//       },
//       {
//         $lookup: {
//           from: "devices",
//           localField: "device",
//           foreignField: "_id",
//           as: "device",
//         },
//       },
//       {
//         $unwind: "$device",
//       },
//     ];

//     if (search.trim()) {
//       pipeline.push({
//         $match: {
//           $or: [
//             { ticketId: regex },
//             { description: regex },
//             { "subscriber.name": regex },
//             { "subscriber.phone": regex },
//             { "device.deviceId": regex },
//             { "device.deviceName": regex },
//           ],
//         },
//       });
//     }

//     const tickets = await Ticket.aggregate(pipeline);

//     res.status(200).json(tickets);
//   } catch (err) {
//     console.error("Error fetching tickets:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// get user ticket by id
exports.getAllTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticket.find({ subscriber: userId });
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found." });
    }

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
