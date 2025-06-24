import express from "express";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/messagesGroups", async (req, res) => {
  const { message, groupchat } = req.body;
  const accessToken = req.cookies["jwt"];

  if (!message || !groupchat) {
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

    await db.execute(
      "INSERT INTO messages (message, groupchat, sender)  VALUES (?, ?, ?)",
      [message, groupchat, token.user_id]
    );

    return res.status(201).json({ message: "Message added to the database!" });
  } catch (err) {
    return res.status(500).json({ err: "Server error" });
  }
});

router.get("/messagesGroup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [messages] = await db.execute(
      "SELECT users.username, messages.sent_date , messages.message FROM messages JOIN users ON messages.sender = users.user_id WHERE groupchat = ?",
      [id]
    );

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no message in this group!" });
    }

    res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/messagesPrivate/:reciever_id", async (req, res) => {
  const { reciever_id } = req.params;

  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [messagesPrivate] = await db.execute(
      `SELECT messages.sent_date, messages.message, sender.username AS sender_username, reciever.username AS reciever_username FROM messages JOIN users AS sender ON messages.sender = sender.user_id JOIN users AS reciever ON messages.reciever = reciever.user_id WHERE ((messages.sender = ? AND messages.reciever = ?) OR (messages.sender = ? AND messages.reciever = ?)) AND messages.groupchat IS NULL`,
      [token.user_id, reciever_id, reciever_id, token.user_id]
    );

    if (messagesPrivate.length === 0) {
      return res.status(404).json({ message: "There is no message" });
    }

    res.status(200).json(messagesPrivate);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/messagesPrivate", async (req, res) => {
  const { reciever, message } = req.body;
  const accessToken = req.cookies["jwt"];

  if (!reciever || !message) {
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

    await db.execute(
      "INSERT INTO messages (sender, reciever, message)  VALUES (?, ?, ?)",
      [token.user_id, reciever, message]
    );

    return res.status(201).json({ message: "Message created successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error!" });
  }
});

export default router;
