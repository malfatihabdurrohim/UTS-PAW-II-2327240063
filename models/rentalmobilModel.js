const mongoose = require('mongoose');

// 1. EMBEDDED SCHEMA: rentalmobil (Subdocument)
const rentalmobilSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Buku', bukuSchema);
