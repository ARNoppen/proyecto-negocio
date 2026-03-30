const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.patch('/:id/toggle', productsController.toggleActive);

module.exports = router;
