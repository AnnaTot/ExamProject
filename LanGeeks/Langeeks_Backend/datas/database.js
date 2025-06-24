import mysql from "mysql2/promise.js";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "langeeks",
});

db.connect((err) => {
  if (err) {
    console.error("Hiba:", err);
  } else {
    console.log("Siker");
  }
});

export { db };
