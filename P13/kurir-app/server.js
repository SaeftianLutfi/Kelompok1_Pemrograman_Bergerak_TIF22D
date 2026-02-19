const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const verifyToken = require('./verifyToken');

const app = express();
const SECRET_KEY = "kurir-secret-key";

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ================== LAPORAN ==================
app.post('/home', verifyToken, async (req, res) => {
  try {

    const { no_resi, foto, latitude, longitude, status } = req.body;
    const id_kurir = req.user.id;

    console.log("DATA MASUK:");
    console.log("id_kurir:", id_kurir);
    console.log("no_resi:", no_resi);
    console.log("latitude:", latitude);
    console.log("longitude:", longitude);
    console.log("status:", status);

    const [result] = await db.query(
      `INSERT INTO laporan 
       (id_kurir, no_resi, foto, latitude, longitude, status, create_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [id_kurir, no_resi, foto, latitude, longitude, status]
    );

    res.json({ message: 'Laporan berhasil dikirim' });

  } catch (err) {
    console.error("ERROR DETAIL:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================== GET LAPORAN ==================
app.get('/home', verifyToken, async (req, res) => {
  try {

    const [rows] = await db.query("SELECT * FROM laporan");

    res.json(rows);

  } catch (err) {
    console.error("SELECT ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ================== REGISTER ==================
app.post('/register', async (req, res) => {
  try {

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username,password) VALUES (?,?)",
      [username, hashedPassword]
    );

    res.json({ message: "Register berhasil" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ================== LOGIN ==================
app.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result.length === 0)
      return res.status(400).json({ message: "User tidak ditemukan" });

    const user = result[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      userId: user.id
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== START SERVER ==================
app.listen(3000, '0.0.0.0', () => {
  console.log("Server jalan di port 3000");
});
