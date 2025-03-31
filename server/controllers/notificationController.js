const Notification = require("../models/Notification");

const getNotificationsByUser = async (req, res) => {
  try {
    console.log("User object from token:", req.user);
    const userId = req.user.id;

    console.log("Fetching unread notifications for recipient ID:", userId);

    const notifications = await Notification.find({
      recipient: userId,
      isRead: false,
    });

    console.log("Unread notifications found:", notifications);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    console.log("Marking notifications as read for user:", req.user.id);

    const result = await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    console.log("Notifications updated:", result.modifiedCount);
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getNotificationsByUser, markNotificationsAsRead };
