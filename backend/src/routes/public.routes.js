const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// NOTA: Estas rutas NO usan el middleware protect, son de acceso libre.
router.get('/settings', publicController.getSettings);
router.get('/products', publicController.getProducts);
router.get('/products/:id', publicController.getProductById);
router.get('/categories', publicController.getCategories);

module.exports = router;
