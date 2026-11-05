const mongoose = require('mongoose');

// 1. EMBEDDED SCHEMA: sewamobil (Subdocument)
const sewamobilSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama rental wajib diisi'],
    trim: true
  },
  kota: {
    type: String,
    trim: true,
    default: 'Palembang'
  }
}, { _id: false });

// 2. MAIN SCHEMA: Buku
const sewaSchema = new mongoose.Schema({
  rentalmobil: { 
    type: String, 
    required: [true, 'sewa mobil wajib diisi'], 
    trim: true 
  },
  alamat: { 
    type: String, 
    required: [true, 'Penulis wajib diisi'], 
    trim: true 
  },
 waktusewa: { 
    type: Number, 
    required: [true, 'Tahun terbit wajib diisi'],
    min: [1900, 'Tahun tidak valid'],
    max: [2100, 'Tahun tidak valid']
  },
  // EMBEDDING: Penerbit
  penerbit: penerbitSchema,
  // REFERENCING: Relasi ke Kategori
  kategoriId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kategori' 
  }
}, { timestamps: true });

module.exports = mongoose.model('RentalMobil', rentalmobilSchema);
