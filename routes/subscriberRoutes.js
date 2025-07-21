
const express = require('express');
const {
  addSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriberById,
} = require("../controllers/subscriberController");
const verifyToken = require('../middleware/authMiddleware');
const { addPointToSubscriber } = require('../controllers/admin/addSunSmiles');
const router = express.Router();

router.post("/add/subscribers", verifyToken,addSubscriber);
router.post("/get/all/subscribers", verifyToken,getAllSubscribers );
router.get("/get/subscriber/by/:id", verifyToken, getSubscriberById);
router.put("/update/subscriber/:id", verifyToken, updateSubscriberById);
router.post("/subscriber/:subscriberId/add/sunSmiles", verifyToken,addPointToSubscriber);

module.exports = router;
