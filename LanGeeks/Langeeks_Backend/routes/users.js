import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../datas/database.js";

const app = express();
app.use(express.json());

const router = express.Router();

router.get("/users", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [users] = await db.execute(
      "SELECT users.username,user_id,languages.languagename FROM users JOIN languages ON users.language_id = languages.language_id"
    );

    res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email, language_id } = req.body;

  if (!username || !password || !email || !language_id) {
    return res.status(400).json({ message: "Fill everything!" });
  }

  try {
    const [hasUsername] = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (hasUsername.length > 0) {
      return res.status(400).json({ message: "Its already in the database!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUSer] = await db.execute(
      "INSERT INTO users (username, password, email, language_id) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, language_id]
    );

    const [findUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const user = findUser[0];

    const token = jwt.sign({ user_id: user.user_id }, "secret-key");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        username: user.username,
        ban_date_end: user.ban_date_end,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Error registering the user." });
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Cannot find the user!" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing data!" });
  }

  try {
    const [findUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = findUser[0];

    if (!user) {
      return res.status(404).json({ message: "Cannot find the user!" });
    }

    const [banTimeEnd] = await db.execute(
      "SELECT ban_date_end, username FROM users WHERE username = ?",
      [username]
    );

    const bannedPerson = banTimeEnd[0];

    if (bannedPerson.ban_date_end) {
      const banTime = bannedPerson.ban_date_end - new Date().getTime();

      if (banTime < 0) {

        await db.execute(
          "UPDATE users SET ban_date_end = NULL WHERE username = ?",
          [bannedPerson.username]
        );

        const goodPassword = await bcrypt.compare(password, user.password);

        if (!goodPassword) {
          return res.status(401).json({ message: "Wrong password!" });
        }

        const [languagenameFind] = await db.execute(
          "SELECT languagename FROM languages WHERE language_id = ?",
          [user.language_id]
        );

        const languagename = languagenameFind[0];

        const token = jwt.sign({ user_id: user.user_id }, "secret-key");

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          user: {
            username: user.username,
            languagename: languagename,
            ban_date_end: user.ban_date_end,
          },
        });
      } else {
        const days = Math.floor(banTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (banTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((banTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((banTime % (1000 * 60)) / 1000);
        const countdownText = `${days} day ${hours} hours ${minutes} minutes ${seconds} seconds`;

        console.log(countdownText);

        return res.status(403).json({
          message: "User is baned :(",
          bannedTime: countdownText,
        });
      }
    }

    const goodPassword = await bcrypt.compare(password, user.password);

    if (!goodPassword) {
      return res.status(401).json({ message: "Wrong password!" });
    }

    const token = jwt.sign({ user_id: user.user_id }, "secret-key");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const [languagenameFind] = await db.execute(
      "SELECT languagename FROM languages WHERE language_id = ?",
      [user.language_id]
    );

    const languagename = languagenameFind[0];

    res.status(200).json({
      user: {
        username: user.username,
        languagename: languagename,
        ban_date_end: user.ban_date_end,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res
    .cookie("jwt", "", { maxAge: 0 })
    .status(200)
    .json({ message: "Logout successful" });
});

router.get("/userLoggedinCheck", async (req, res) => {
  const accessToken = req.cookies["jwt"];

  try {
    if (!accessToken) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const token = jwt.verify(accessToken, "secret-key");

    if (!token || !token.user_id) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const [users] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      token.user_id,
    ]);

    const [languagename] = await db.execute(
      "SELECT languagename FROM users JOIN languages ON users.language_id = languages.language_id WHERE user_id = ?",
      [token.user_id]
    );

    const userOne = users[0];
    const languagenameOne = languagename[0];

    res.status(201).json({
      user: {
        username: userOne.username,
        languagename: languagenameOne,
        ban_date_end: userOne.ban_date_end,
        message: "User is checked and logged in",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

export default router;
