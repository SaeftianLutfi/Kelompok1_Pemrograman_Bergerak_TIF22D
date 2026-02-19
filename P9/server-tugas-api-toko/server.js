// Mengimport library yang dibutuhkan 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Insisialisasi aplikasi dan port
const app = express();
const PORT = 3000;

// Middleware untuk membaca data JSON
app.use(bodyParser.json());

// Konfigurasi CORS
app.use(cors({
  origin: 'http://localhost:8100'
}));

// Data dummy (Simulasi data barang)
let barang = [
  { id: 1, nama_barang: 'Beras 5kg', harga: 65000 }
];

// Endpoint untuk mengambil data barang
app.get('/api/barang', (req, res) => {
  res.json(barang);
});

// Endpoint untuk menambahkan data barang
app.post('/api/barang', (req, res) => {

  // Menambahkan barang baru
  const { nama_barang, harga } = req.body;

  const newBarang = {
    id: barang.length + 1,
    nama_barang,
    harga
  };

  // Menambahkan barang baru ke dalam array
  barang.push(newBarang);

  console.log("Barang ditambahkan:", newBarang);

  // Kirim response
  res.json(newBarang);
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
