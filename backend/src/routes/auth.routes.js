const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Rutas Públicas de Auth
router.post('/login', authController.login);

// Rutas Protegidas de Auth (requieren Token)
router.get('/me', protect, authController.getMe);

module.exports = router;
