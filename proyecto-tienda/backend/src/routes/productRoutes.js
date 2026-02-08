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
// Obtener productos (El controlador aplica el filtro de existencia > 0 y paginación)
router.get('/', productController.obtenerProductos);

// --- RUTAS PROTEGIDAS (SOLO ADMIN) ---
// REQUISITO: Solo el admin crea, edita y elimina
router.post('/', [auth, isAdmin], productController.crearProducto);
router.delete('/:id', [auth, isAdmin], productController.eliminarProducto);

// CORRECCIÓN AQUÍ: Usamos 'auth', 'isAdmin' y llamamos al controller correctamente
router.put('/:id', [auth, isAdmin], productController.actualizarProducto);

module.exports = router;