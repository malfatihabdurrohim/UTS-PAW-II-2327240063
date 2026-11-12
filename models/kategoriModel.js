const mongoose = require('mongoose');

// SCHEMA RENTAL MOBIL
const kategoriSchema = new mongoose.Schema({

  kode: {
    type: String,
    required: [true, 'kode wajib diisi'],
    trim: true
  },

   nama: {
    type: String,
    required: [true, 'nama wajib diisi'],
    trim: true
  },

}, { timestamps: true });

// EXPORT MODEL
module.exports = mongoose.model('Kategori', kategoriSchema);