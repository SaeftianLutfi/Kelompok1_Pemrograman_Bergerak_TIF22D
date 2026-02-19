const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/laporan', upload.single('foto'), (req,res)=>{

    const { idKurir, noResi, latitude, longitude } = req.body;
    const foto = req.file.filename;

    db.query(
        "INSERT INTO laporan (id_kurir,no_resi,foto,latitude,longitude,status) VALUES (?,?,?,?,?,'Terkirim')",
        [idKurir,noResi,foto,latitude,longitude],
        (err)=>{
            if(err) return res.status(500).json(err);
            res.json({message:"Data tersimpan"});
        }
    );
});

app.listen(3000,()=>console.log("Server jalan"));
