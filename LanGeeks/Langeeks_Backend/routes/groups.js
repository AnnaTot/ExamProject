import express from "express";
import cors from "cors";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/groups", async (req, res) => {
  try {
    const [groupsAll] = await db.execute(
      "SELECT groupname, group_id, groupadmin_id FROM groups"
    );

    res.json(groupsAll);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/groups", async (req, res) => {
  const { groupname } = req.body;
  const accessToken = req.cookies["jwt"];
  console.log(groupname)

  if (!groupname) {
    return res.status(400).json({ error: "You must fill it!" });
  }

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [alreadyIngroupname] = await db.execute(
      "SELECT * FROM groups WHERE groupname = ?",
      [groupname]
    );

    if (alreadyIngroupname.length > 0) {
      return res
        .status(400)
        .json({ error: "Group is already in the database!" });
    }

    const [tooManyGroups] = await db.execute(
      "SELECT groups.groupname FROM groups WHERE groupadmin_id = ?",
      [token.user_id]
    );


    if (tooManyGroups.length >= 7) {
      return res.status(403).json({ error: "Max limmit reached!" });
    }

    await db.execute(
      "INSERT INTO groups (groupname, groupadmin_id) VALUES (?, ?)",
      [groupname, token.user_id]
    );


    const [newGroup] = await db.execute(
      "SELECT * FROM groups WHERE groupname = ?",
      [groupname]
    );

    console.log(newGroup)

    return res.status(201).json({
      group: newGroup,
      message: "Group created succesfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/groupsDelete/:id", async (req, res) => {
  const group_id = req.params.id;

  try {
    const [groupMemberDelete] = await db.execute(
      "DELETE groupmembers FROM groupmembers JOIN groups ON groupmembers.group_id = groups.group_id WHERE groups.group_id = ?",
      [group_id]
    );

    const [groupMessageDelete] = await db.execute(
      "DELETE messages FROM messages JOIN groups ON messages.groupchat = groups.group_id WHERE groups.group_id = ?",
      [group_id]
    );

    const [groupNotificationDelete] = await db.execute(
      "DELETE notifications FROM notifications JOIN groups ON notifications.sent_to_group = groups.group_id WHERE groups.group_id = ?",
      [group_id]
    );

    const [groupDelete] = await db.execute(
      "DELETE FROM groups WHERE group_id = ?",
      [group_id]
    );

    if (
      groupMemberDelete.affectedRows === 0 &&
      groupMessageDelete.affectedRows === 0 &&
      groupDelete.affectedRows === 0
    ) {
      return res.status(404).json({ message: "Cannot find it!" });
    }

    res.status(201).json({ message: "Group is deleted succesfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting the group!" });
  }
});

router.get("/groupAdmin", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [groupsByAdmin] = await db.execute(
      "SELECT groupname, group_id, groupadmin_id FROM groups WHERE groupadmin_id = ?",
      [token.user_id]
    );

    res.json(groupsByAdmin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/groupsUserin", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [groupsUserin] = await db.execute(
      "SELECT groups.groupname, groups.group_id, groups.groupadmin_id FROM groups JOIN groupmembers ON groups.group_id = groupmembers.group_id WHERE groupmembers.user_id = ?",
      [token.user_id]
    );

    if (groupsUserin.length === 0) {
      return res.status(404).json({ message: "Cannot find the it!" });
    }

    res.json(groupsUserin);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/groupnameByid/:id", async (req, res) => {
  const group_id = req.params.id;

  try {
    const [groupnameByid] = await db.execute(
      "SELECT groups.groupname FROM groups WHERE group_id = ?",
      [group_id]
    );

    res.json(groupnameByid);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/groupAdminName/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [groupAdminUsername] = await db.execute(
      "SELECT users.username FROM users JOIN groups ON groups.groupadmin_id = users.user_id WHERE groups.groupadmin_id = ?",
      [id]
    );

    const groupAdminUsernameOne = groupAdminUsername[0];

    res.json(groupAdminUsernameOne);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
