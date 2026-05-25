// Archivo: /backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middleware/authMiddleware');

// Rutas públicas (no necesitan token)
router.post('/login', authController.login);
router.post('/register', authController.register);

// Ruta protegida: comprueba que el token siga siendo válido
router.get('/me', verificarToken, authController.obtenerPerfil);

module.exports = router;
