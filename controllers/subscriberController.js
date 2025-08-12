const Subscriber = require("../models/Subscriber");

// Helper to generate referral code
function generateReferralCode(name) {
  const namePart = name
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${namePart}${randomPart}`;
}

exports.addSubscriber = async (req, res) => {
  try {
    const { name, phone, email, city, area, pincode, fullAddress } = req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !city ||
      !area ||
      !pincode ||
      !fullAddress
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Subscriber.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      return res
        .status(409)
        .json({
          message: "Subscriber already exists with this email or phone.",
        });
    }

    // Generate unique referral code
    let referralCode;
    let isReferralUnique = false;

    while (!isReferralUnique) {
      referralCode = generateReferralCode(name);
      const existingReferral = await Subscriber.findOne({ referralCode });
      if (!existingReferral) {
        isReferralUnique = true;
      }
    }

    // Generate unique subId like subsc1, subsc2
    let subId;
    let counter = 1;
    let unique = false;

    while (!unique) {
      subId = `subsc${counter}`;
      const existingSub = await Subscriber.findOne({ subId });
      if (!existingSub) {
        unique = true;
      } else {
        counter++;
      }
    }

    const subscriber = new Subscriber({
      subId,
      referralCode,
      name,
      phone,
      email,
      city,
      area,
      pincode,
      fullAddress,
    });

    await subscriber.save();

    res
      .status(201)
      .json({ message: "Subscriber added successfully", subscriber });
  } catch (err) {
    console.error("Error adding subscriber:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const { search = "" } = req.body; // POST request with JSON body

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { subId: { $regex: search, $options: "i" } },
      ],
    };

    const subscribers = await Subscriber.find(search ? query : {}).sort({
      createdAt: -1,
    });
    res.status(200).json(subscribers);
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSubscriberById = async (req, res) => {
  try {
     const subscriber = await Subscriber.findById(req.params.id).populate({
       path: "subscribedDevices.device", // Correct path to populate
       model: "Device", // Explicitly specify the model
       select: "-__v", // Optionally exclude fields
     });
     console.log("subscriber.subscribedDevices", subscriber.subscribedDevices);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json(subscriber);
  } catch (err) {
    console.error("Error fetching subscriber:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSubscriberById = async (req, res) => {
  try {
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.status(200).json(updatedSubscriber);
  } catch (err) {
    console.error("Error updating subscriber:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
