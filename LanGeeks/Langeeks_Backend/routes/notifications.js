import express from "express";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/notifications", async (req, res) => {
  const { sent_to_group, groupadmin_id, message } = req.body;

  const accessToken = req.cookies["jwt"];

  if (!sent_to_group || !groupadmin_id || !message) {
    return res.status(400).json({ message: "Fill everything!" });
  }

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [alreadySentRequest] = await db.execute(
      "SELECT * FROM notifications WHERE sent_by = ? AND sent_to_group = ?",
      [token.user_id, sent_to_group]
    );

    if (alreadySentRequest.length > 0) {
      return res.status(400).json({ message: "Its already in the database!" });
    }

    await db.execute(
      "INSERT INTO notifications (sent_by, sent_to_group, reciver_user, message) VALUES (?, ?, ?, ?)",
      [token.user_id, sent_to_group, groupadmin_id, message]
    );

    return res
      .status(201)
      .json({ message: "Notifications added to the database successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Server error" });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  const notification_id = req.params.id;

  try {
    const [notification] = await db.execute(
      "DELETE FROM notifications WHERE notification_id = ?",
      [notification_id]
    );

    if (notification.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "notifications cannot be found!" });
    }

    res.json(200);
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
});

router.get("/notificationsByuserId", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [notification] = await db.execute(
      "SELECT * FROM notifications WHERE reciver_user = ?",
      [token.user_id]
    );

    if (notification.length === 0) {
      return res.status(404).json({ message: "Cannot find the notification!" });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ err: "Server error!" });
  }
});

export default router;
