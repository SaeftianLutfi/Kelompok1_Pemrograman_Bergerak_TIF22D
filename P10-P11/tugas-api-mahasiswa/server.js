const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:8100'
}));

// Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_kampus'
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

app.get('/api/mahasiswa', (req, res) => {
  db.query("SELECT * FROM mahasiswa", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/api/mahasiswa', (req, res) => {

  const { nim, nama, program_studi, jenis_kelamin } = req.body;

  db.query("SELECT * FROM mahasiswa WHERE nim = ?", [nim], (err, result) => {

    if (result.length > 0) {
      return res.status(400).json({
        message: "NIM sudah terdaftar!"
      });
    }

    const sql = `
      INSERT INTO mahasiswa (nim, nama, program_studi, jenis_kelamin)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nim, nama, program_studi, jenis_kelamin], (err, result) => {
      if (err) throw err;
      res.json({ message: "Data berhasil ditambahkan" });
    });
  });
});

app.delete('/api/mahasiswa/:id', (req, res) => {

  db.query("DELETE FROM mahasiswa WHERE id = ?", [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Data dihapus" });
  });

});

app.put('/api/mahasiswa/:id', (req, res) => {

  const { nim, nama, program_studi, jenis_kelamin } = req.body;

  const sql = `
    UPDATE mahasiswa
    SET nim=?, nama=?, program_studi=?, jenis_kelamin=?
    WHERE id=?
  `;

  db.query(sql, [nim, nama, program_studi, jenis_kelamin, req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Data diupdate" });
  });

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
