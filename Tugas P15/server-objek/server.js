const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// =======================
// DATABASE CONNECTION
// =======================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_ojeksiber'
});

// =======================
// FORENSIC MIDDLEWARE
// =======================
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();

  console.log(
    `[FORENSIC LOG] TIME: ${timestamp} | IP: ${ip} | DEVICE: ${userAgent} | PATH: ${req.path}`
  );

  next();
});

// =======================
// 1. LOGIN TIDAK AMAN
// =======================
app.post('/api/login-vulnerable', (req, res) => {
  const { username, password } = req.body;

  // ⚠️ BAHAYA: String digabung langsung (SQL Injection)
  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({
        message: 'LOGIN BERHASIL (Vulnerable)',
        user: results[0]
      });
    } else {
      res.status(401).json({ message: 'Login Gagal' });
    }
  });
});

// =======================
// 2. LOGIN AMAN
// =======================
app.post('/api/login-secure', (req, res) => {
  const { username, password } = req.body;

  // ✅ AMAN: Placeholder (Prepared Statement)
  const query = `
    SELECT * FROM users 
    WHERE username = ? 
    AND password = ?
  `;

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({
        message: 'LOGIN BERHASIL (Secure)',
        user: results[0]
      });
    } else {
      res.status(401).json({ message: 'Login Gagal' });
    }
  });
});

// =======================
// 3. DETEKSI FAKE GPS
// =======================
app.post('/api/absen-lokasi', (req, res) => {
  const { lat, lng, isMock } = req.body;
  const ip = req.socket.remoteAddress;

  if (isMock === true) {
    console.log(`[ALERT] FAKE GPS DETECTED from IP: ${ip}`);

    return res.status(403).json({
      message: 'DILARANG MENGGUNAKAN TUYUL (Fake GPS)!'
    });
  }

  res.json({
    message: 'Absen Lokasi Berhasil Diterima'
  });
});

// =======================
app.listen(3000, () => {
  console.log('Server OjekSiber berjalan di port 3000');
});