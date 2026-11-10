const express = require('express');
const router = express.Router();

// Import Controller Rental Mobil
const rentalMobilController = require('../controllers/RentalMobilController');

// Import Middleware API Key
const cekApiKey = require('../middlewares/cekApiKey');

// Route Rental Mobil
router.get('/', rentalMobilController.getAll);
router.get('/:id', rentalMobilController.getById);
router.post('/', cekApiKey, rentalMobilController.create);
router.put('/:id', cekApiKey, rentalMobilController.update);
router.delete('/:id', cekApiKey, rentalMobilController.remove);

module.exports = router;
