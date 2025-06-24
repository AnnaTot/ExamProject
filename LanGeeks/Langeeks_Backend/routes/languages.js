import express from "express";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/languages", async (req, res) => {
  try {
    const [languages] = await db.execute("SELECT * FROM languages");

    res.json(languages);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/usersLanguage", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  const { language_id } = req.body;

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [samelanguage] = await db.execute(
      "SELECT language_id FROM users WHERE user_id = ?",
      [token.user_id]
    );

    if (samelanguage[0].language_id === language_id) {
      return res.status(400).json({ message: "Its the same language!" });
    }

    const [updatedUser] = await db.execute(
      "UPDATE users SET language_id = ? WHERE user_id = ?",
      [language_id, token.user_id]
    );

    if (updatedUser.affectedRows === 0) {
      return res.status(404).json({ message: "Cannot find the user!" });
    }

      const [updatedUsersLanguage] = await db.execute(
      "SELECT languages.languagename, languages.language_id FROM users JOIN languages ON users.language_id = languages.language_id WHERE user_id = ?",
      [token.user_id]
    );

    console.log(updatedUsersLanguage[0])
    res.status(200).json({ 
      languagename:updatedUsersLanguage[0],
      message: "User uptated succesfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Server error!" });
  }
});

export default router;
