const express = require("express");
const { verifyToken } = require("../utils/jwtHelper");
const {
  getNotificationsByUser,
  markNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();
router.get("/", verifyToken, getNotificationsByUser);

// ✅ If marking notifications as read
router.put("/markNotificationsAsRead", verifyToken, markNotificationsAsRead);

module.exports = router;
