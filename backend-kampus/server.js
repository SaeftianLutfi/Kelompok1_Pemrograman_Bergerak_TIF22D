const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const verifyToken = require('./middleware/verifyToken');
const { onlyDosen } = require('./middleware/roleMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "kampus_rahasia";

// ================= REGISTER =================
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (username,password,role) VALUES (?,?,?)",
            [username, hashedPassword, role],
            (err) => {
                if (err) {
                    console.error("REGISTER ERROR:", err);
                    return res.status(500).json({ message: "Database error" });
                }
                res.json({ message: "Register Berhasil!" });
            }
        );
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= LOGIN =================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, result) => {

            if (err) {
                console.error("LOGIN ERROR:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0)
                return res.status(400).json({ message: "User tidak ditemukan" });

            const user = result[0];

            const valid = await bcrypt.compare(password, user.password);

            if (!valid)
                return res.status(400).json({ message: "Password salah" });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: "1d" }
            );

            res.json({ token });
        }
    );
});

// ================= GET DATA =================
app.get('/home', verifyToken, (req, res) => {

    db.query("SELECT * FROM mahasiswa", (err, result) => {

        if (err) {
            console.error("SELECT ERROR:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
});

// ================= ADD DATA =================
app.post('/home', verifyToken, onlyDosen, (req, res) => {

    const { nim, nama, program_studi, jenis_kelamin } = req.body;

    if (!nim || !nama || !program_studi || !jenis_kelamin) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    db.query(
        "INSERT INTO mahasiswa (nim,nama,program_studi,jenis_kelamin) VALUES (?,?,?,?)",
        [nim, nama, program_studi, jenis_kelamin],
        (err, result) => {

            if (err) {
                console.error("INSERT ERROR:", err);
                return res.status(500).json({ message: "Database error", error: err.sqlMessage });
            }

            res.json({ message: "Data ditambahkan" });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
