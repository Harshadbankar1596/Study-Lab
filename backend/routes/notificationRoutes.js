// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/notificationController");

router.post("/post/notification", ctrl.createNotification);
router.get("/get/notifications", ctrl.getNotifications);
router.patch("/update/:id", ctrl.updateNotification);
router.delete("/delete/:id", ctrl.deleteNotification);

// send: POST /api/notifications/:id/send or simple POST
router.post("/:id/send", ctrl.sendNotificationToAll);

// token subscription


// 
module.exports = router;
