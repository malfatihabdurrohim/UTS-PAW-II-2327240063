
const express = require('express');
const router = express.Router();

// Controller Rental Mobil
const rentalMobilController = require('../controllers/RentalMobilController');

// Middleware API Key
const cekApiKey = require('../middlewares/cekApiKey');

// Menampilkan semua data rental mobil
router.get('/', rentalMobilController.getAll);

// Menampilkan data rental mobil berdasarkan ID
router.get('/:id', rentalMobilController.getById);

// Menambahkan data rental mobil
router.post('/', cekApiKey, rentalMobilController.create);

// Mengubah data rental mobil
router.put('/:id', cekApiKey, rentalMobilController.update);

// Menghapus data rental mobil
router.delete('/:id', cekApiKey, rentalMobilController.remove);

module.exports = router;