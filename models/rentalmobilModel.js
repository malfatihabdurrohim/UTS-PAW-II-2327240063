const mongoose = require('mongoose');

// 1. EMBEDDED SCHEMA: Informasi Rental
const rentalSchema = new mongoose.Schema({
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

// 2. MAIN SCHEMA: RentalMobil
const rentalMobilSchema = new mongoose.Schema({

  namaRental: {
    type: String,
    required: [true, 'Nama rental mobil wajib diisi'],
    trim: true
  },

  alamat: {
    type: String,
    required: [true, 'Alamat rental wajib diisi'],
    trim: true
  },

  waktuSewa: {
    type: Number,
    required: [true, 'Waktu sewa wajib diisi'],
    min: [1, 'Waktu sewa tidak valid']
  },

  // EMBEDDING: Informasi Rental
  rental: rentalSchema,

  // REFERENCING: Relasi ke Kategori
  kategoriId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kategori',
    required: [true, 'Kategori wajib dipilih']
  }

}, { timestamps: true });

// EXPORT MODEL
module.exports = mongoose.models.RentalMobil ||
  mongoose.model('RentalMobil', rentalMobilSchema);