const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro: /api/auth/register
router.post('/register', authController.registrarUsuario);

// Login: /api/auth/login
router.post('/login', authController.autenticarUsuario);

module.exports = router;