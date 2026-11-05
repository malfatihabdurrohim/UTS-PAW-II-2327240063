const express = require('express');
const router = express.Router();
const rentalmobilController = require('../controllers/rentalmobilController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', rentalmobilController.getAll);
router.get('/:id', rentalmobilController.getById);
router.post('/', cekApiKey, rentalmobilController.create);
router.put('/:id', cekApiKey, rentalmobilController.update);
router.delete('/:id', cekApiKey, rentalmobilController.remove);

module.exports = router;