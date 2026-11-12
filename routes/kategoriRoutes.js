
const express = require('express');
const router = express.Router();

// Controller Rental Mobil
const kategoriController = require('../controllers/kategoriController');

// Middleware API Key
const cekApiKey = require('../middlewares/cekApiKey');

// Menampilkan semua data rental mobil
router.get('/', kategoriController.getAll);

// Menampilkan data rental mobil berdasarkan ID
router.get('/:id', kategoriController.getById);

// Menambahkan data rental mobil
router.post('/', cekApiKey, kategoriController.create);

// Mengubah data rental mobil
router.put('/:id', cekApiKey, kategoriController.update);

// Menghapus data rental mobil
router.delete('/:id', cekApiKey, kategoriController.remove);

module.exports = router;