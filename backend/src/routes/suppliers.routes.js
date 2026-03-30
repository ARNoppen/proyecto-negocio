const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', suppliersController.getAll);
router.get('/:id', suppliersController.getById);
router.post('/', suppliersController.create);
router.put('/:id', suppliersController.update);
router.patch('/:id/toggle', suppliersController.toggleActive);

module.exports = router;
