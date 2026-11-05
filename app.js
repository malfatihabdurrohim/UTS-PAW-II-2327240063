require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const rentalmobilRoutes = require('./routes/rentalmobilRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.json({
    nama_mahasiswa: "M. Alfatih Abdurrohim",
    NIM: "2327240063",
    topik: "RentalMobil (dengan MongoDB, Embedding & Referencing)",
    daftar_endpoint: [
      "GET /buku (Mendukung ?judul=..&tahun=..&penerbit=..&kotaPenerbit=..&kategori=..&page=..&limit=..&sort=..&fields=..)",
      "GET /sewa/:id",
      "POST /sewa (Perlu Header x-api-key)",
      "PUT /sewa/:id (Perlu Header x-api-key)",
      "DELETE /sewa/:id (Perlu Header x-api-key)",
      "GET /kategori",
      "GET /kategori/:id",
      "POST /kategori (Perlu Header x-api-key)"
    ]
  });
});

// ---------- Route per modul ----------
app.use('/rentalmobil', bukuRoutes);
app.use('/kategori', kategoriRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.warn('PERINGATAN: DB_URI belum diatur di file .env.');
  app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT} (tanpa koneksi MongoDB)`));
} else {
  mongoose.connect(DB_URI)
    .then(() => {
      console.log('Terhubung ke MongoDB');
      app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
