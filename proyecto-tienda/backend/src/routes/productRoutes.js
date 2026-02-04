const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

// Ver productos: /api/products (Público)
router.get('/', productController.obtenerProductos);

// Crear producto: /api/products (Protegido - requiere Token)
router.post('/', auth, productController.crearProducto);

// Eliminar producto: /api/products/:id (Protegido)
router.delete('/:id', auth, productController.eliminarProducto);

module.exports = router;