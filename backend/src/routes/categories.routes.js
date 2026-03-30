const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Rutas Públicas (Si se necesita un catálogo público, se separan y no se usa 'protect' o se usa un endpoint diferente)
// En este caso asumo que son las rutas internas de ADMIN, por lo que protegemos todas.
router.use(protect);
// router.use(authorize('admin', 'administracion')); // Si quisieramos restringir todas estas a solos esos roles

router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);

// Si quisieramos restringir solo la modificación al 'admin' principal:
// router.post('/', authorize('admin'), categoriesController.create);
router.post('/', categoriesController.create);
router.put('/:id', categoriesController.update);
router.patch('/:id/toggle', categoriesController.toggleActive);

module.exports = router;
