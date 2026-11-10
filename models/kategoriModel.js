const mongoose = require('mongoose');

// SCHEMA RENTAL MOBIL
const rentalMobilSchema = new mongoose.Schema({

  namaRental: {
    type: String,
    required: [true, 'Nama rental wajib diisi'],
    trim: true
  },

  alamat: {
    type: String,
    required: [true, 'Alamat rental wajib diisi'],
    trim: true
  },

  jamBuka: {
    type: String,
    required: [true, 'Jam buka wajib diisi']
  },

  pilihSewa: {
    type: String,
    required: [true, 'Pilihan sewa wajib diisi']
  },

  kategoriId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kategori',
    required: [true, 'Kategori wajib dipilih']
  }

}, { timestamps: true });

// EXPORT MODEL
module.exports = mongoose.models.RentalMobil ||
  mongoose.model('RentalMobil', rentalMobilSchema);