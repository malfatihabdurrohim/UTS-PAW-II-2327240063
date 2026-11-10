const express = require('express');
const router = express.Router();
const rentalMobilController = require('../controllers/RentalMobilController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', rentalMobilController.getAll);
// router.get('/:id', rentalMobilController.getById);
router.post('/', cekApiKey, rentalMobilController.create);

module.exports = router;