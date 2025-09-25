import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

app.post("/register", async (req, res) => {
  const { name, email, password, year_of_passing, sector, achievements } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      "INSERT INTO alumni (name, email, password_hash, year_of_passing, sector, achievements) VALUES ($1,$2,$3,$4,$5,$6)",
      [name, email, hashed, year_of_passing, sector, achievements]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM alumni WHERE email=$1", [email]);
  if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

  const user = result.rows[0];
  if (!(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
});

app.get("/search", async (req, res) => {
  const { year, sector } = req.query;
  const result = await pool.query(
    "SELECT name, year_of_passing, sector, achievements FROM alumni WHERE ($1::int IS NULL OR year_of_passing=$1) AND ($2::text IS NULL OR sector=$2)",
    [year || null, sector || null]
  );
  res.json(result.rows);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
app.get("/", (req, res) => {
  res.send("Alumni Backend is running!");
});
