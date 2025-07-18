const Subscriber = require("../../models/Subscriber");

exports.addPointToSubscriber = async (req, res) => {
  const { subscriberId } = req.params;
  const { description, month, year, powerGenerated, points } = req.body;

  // Description is optional, so not required here
  if (
    !month ||
    !year ||
    powerGenerated == null ||
    points == null
  ) {
    return res.status(400).json({ message: "Month, year, powerGenerated, and points are required" });
  }

  try {
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    const newPoint = {
      description, // can be undefined or empty
      month,
      year: year.toString(),
      powerGenerated,
      points,
    };

    subscriber.points.push(newPoint);
    subscriber.sunSmiles = (subscriber.sunSmiles || 0) + points;

    await subscriber.save();

    res.status(200).json({ message: "Point added successfully", subscriber });
  } catch (error) {
    console.error("Error adding point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
