const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:8100'
}));

let barang = [
  { id: 1, nama_barang: 'Beras 5kg', harga: 65000 }
];

app.get('/api/barang', (req, res) => {
  res.json(barang);
});

app.post('/api/barang', (req, res) => {

  const { nama_barang, harga } = req.body;

  const newBarang = {
    id: barang.length + 1,
    nama_barang,
    harga
  };

  barang.push(newBarang);

  console.log("Barang ditambahkan:", newBarang);

  res.json(newBarang);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
