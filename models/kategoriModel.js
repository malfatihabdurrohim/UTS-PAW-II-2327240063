const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  kode: { 
    type: String, 
    required: [true, 'Kode kategori wajib diisi'], 
    unique: true, 
    trim: true, 
    uppercase: true 
  },
  namaKategori: { 
    type: String, 
    required: [true, 'Nama kategori wajib diisi'], 
    trim: true 
  },
  deskripsi: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Kategori', kategoriSchema);
