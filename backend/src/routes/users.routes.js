const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Todas las rutas de usuarios requieren estar logueado y ser 'admin'
router.use(protect);
router.use(authorize('admin'));

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.patch('/:id/toggle', usersController.toggleActive);

module.exports = router;
