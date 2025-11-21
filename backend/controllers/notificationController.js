// controllers/notificationController.js
const Notification = require("../models/notificationModel");
const admin = require('../utils/firebase')
const UserToken = require("../models/UserToken");

// Create
exports.createNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Title and body required" });
    const notification = await Notification.create({ title, body });
    res.json({ success: true, notification });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Read all
exports.getNotifications = async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications: list });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Update
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const updated = await Notification.findByIdAndUpdate(id, { title, body }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, notification: updated });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Delete
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Send to topic allUsers
exports.sendNotificationToAll = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      topic: "allUsers",
    };

    // send via firebase admin
    const response = await admin.messaging().send(message);

    notification.sent = true;
    notification.sentAt = new Date();
    await notification.save();

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Subscribe a token to allUsers topic
exports.subscribeTokenToTopic = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    // Subscribe token to topic
    await admin.messaging().subscribeToTopic(token, "allUsers");
    res.json({ success: true, message: "Subscribed to allUsers" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.saveFCMToken = async (req, res) => {
  try {
    const { token, userId } = req.body;
    const user = req.user;

    if (!token) return res.status(400).json({ message: "Token is required" });

    const existing = await UserToken.findOne({ token });

    if (existing) {
      return res.json({ success: true, message: "Token already saved" });
    }

    await UserToken.create({ token, userId: user._id });

    res.json({ success: true, message: "Token saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 