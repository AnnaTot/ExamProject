import express from "express";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.delete("/groupMemberBan/:id", async (req, res) => {
  const group_id = req.params.id;

  try {
    const [groupMemberBan] = await db.execute(
      "DELETE groupmembers FROM groupmembers JOIN groups ON groupmembers.group_id = groups.group_id WHERE groupmembers.user_id = ? ",
      [group_id]
    );

    if (groupMemberBan.affectedRows === 0) {
      return res.status(404).json({ message: "Cannot find it!" });
    }

    res.status(201).json({ message: "Groupmember is banned succesfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Error banning the user!" });
  }
});

router.delete("/groupMemberleaveGroup/:id", async (req, res) => {
  const group_id = req.params.id;
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [groupMemberleave] = await db.execute(
      "DELETE groupmembers FROM groupmembers WHERE groupmembers.group_id = ? AND groupmembers.user_id = ?;",
      [group_id, token.user_id]
    );

    if (groupMemberleave.affectedRows === 0) {
      return res.status(404).json({ message: "Cannot find it!" });
    }

    res
      .status(201)
      .json({ message: "Groupmember left the group succesfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Error leaving the group!" });
  }
});

router.post("/groupmembers", async (req, res) => {
  const { user_id, group_id } = req.body;

  if (!user_id || !group_id) {
    return res
      .status(400)
      .json({ message: "You need the user ID and group ID!" });
  }

  try {
    const [group] = await db.execute(
      "SELECT * FROM groups WHERE group_id = ?",
      [group_id]
    );

    if (group.length === 0) {
      return res.status(404).json({ message: "Cannot find the group!" });
    }

    const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Cannot find the user!" });
    }

    await db.execute(
      "INSERT INTO groupmembers (user_id, group_id) VALUES (?, ?)",
      [user_id, group_id]
    );

    res.status(201).json({ message: "Groupmember added succesfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/groupmembersByGroupId/:id", async (req, res) => {
  const group_id = req.params.id;

  try {
    const [groupmembers] = await db.execute(
      "SELECT users.username, groupmembers.group_id, groupmembers.user_id FROM groupmembers JOIN users ON groupmembers.user_id = users.user_id WHERE group_id = ?",
      [group_id]
    );

    res.json(groupmembers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/groupmembersByUserId", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");
    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [groupmembers] = await db.execute(
      "SELECT * FROM groupmembers WHERE user_id = ?",
      [token.user_id]
    );

    res.json(groupmembers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
