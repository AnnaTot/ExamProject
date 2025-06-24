import express from "express";
import { db } from "../datas/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/RuleBreaks", async (req, res) => {
  const { rulebreak_descripson } = req.body;
  const accessToken = req.cookies["jwt"];

  if (!rulebreak_descripson) {
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
      "INSERT INTO rulebreaks (rulebreak_description, reporter) VALUES (?, ?)",
      [rulebreak_descripson, token.user_id]
    );

    return res
      .status(201)
      .json({ message: "Rulebreaks added to the database successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error!" });
  }
});

export default router;
