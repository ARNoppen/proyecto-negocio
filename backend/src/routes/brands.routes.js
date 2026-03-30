const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brands.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', brandsController.getAll);
router.get('/:id', brandsController.getById);
router.post('/', brandsController.create);
router.put('/:id', brandsController.update);
router.patch('/:id/toggle', brandsController.toggleActive);

module.exports = router;
