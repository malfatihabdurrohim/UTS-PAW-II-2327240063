const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', kategoriController.getAll);
router.get('/:id', kategoriController.getById);
router.post('/', cekApiKey, kategoriController.create);

module.exports = router;
