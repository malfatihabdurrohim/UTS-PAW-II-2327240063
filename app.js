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

// ---------- Middleware Global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route Dasar ----------
app.get('/', (req, res) => {
  res.json({
    nama_mahasiswa: "M. Alfatih Abdurrohim",
    NIM: "2327240063",
    topik: "Rental Mobil (dengan MongoDB, Embedding & Referencing)",
    daftar_endpoint: [
      "GET /rentalmobil",
      "GET /rentalmobil/:id",
      "POST /rentalmobil (Perlu Header x-api-key)",
      "PUT /rentalmobil/:id (Perlu Header x-api-key)",
      "DELETE /rentalmobil/:id (Perlu Header x-api-key)",
      "GET /kategori",
      "GET /kategori/:id",
      "POST /kategori (Perlu Header x-api-key)"
    ]
  });
});

// ---------- Route Per Modul ----------
app.use('/rentalmobil', rentalmobilRoutes);
app.use('/kategori', kategoriRoutes);

// ---------- Handler 404 dan Error Handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Koneksi MongoDB ----------
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.warn('PERINGATAN: DB_URI belum diatur di file .env.');

  app.listen(PORT, () => {
    console.log(`Server Rental Mobil berjalan di http://localhost:${PORT} (tanpa koneksi MongoDB)`);
  });

} else {
  mongoose.connect(DB_URI)
    .then(() => {
      console.log('Terhubung ke MongoDB');

      app.listen(PORT, () => {
        console.log(`Server Rental Mobil berjalan di http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;