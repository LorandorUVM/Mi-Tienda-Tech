const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

// Middleware interno para validar si es Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ mensaje: "Acceso denegado: Se requieren permisos de administrador" });
    }
};

// --- RUTAS PÚBLICAS ---
// Obtener productos (Aquí el controlador debe aplicar el filtro de existencia > 0)
router.get('/', productController.obtenerProductos);

// --- RUTAS PROTEGIDAS (SOLO ADMIN) ---
// REQUISITO: Solo el admin crea y elimina
router.post('/', [auth, isAdmin], productController.crearProducto);
router.delete('/:id', [auth, isAdmin], productController.eliminarProducto);
router.put('/:id', authMiddleware, adminMiddleware, actualizarProducto);

module.exports = router;