const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', bukuController.getAll);
router.get('/:id', bukuController.getById);
router.post('/', cekApiKey, bukuController.create);
router.put('/:id', cekApiKey, bukuController.update);
router.delete('/:id', cekApiKey, bukuController.remove);

module.exports = router;