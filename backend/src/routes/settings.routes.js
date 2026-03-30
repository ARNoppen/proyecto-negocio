const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middlewares/auth.middleware');

// Todas las rutas de configuración requieren autenticación
router.use(protect);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
