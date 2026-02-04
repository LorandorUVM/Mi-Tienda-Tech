const Product = require('../models/Product');

// OBTENER PRODUCTOS (Público - con filtros y paginación)
exports.obtenerProductos = async (req, res) => {
    try {
        const { pagina = 1, buscar, categoria } = req.query;
        const limite = 6; // Productos por página
        const skip = (pagina - 1) * limite;

        // Filtro base: Solo productos con cantidad mayor a 0
        let query = { cantidad: { $gt: 0 } };

        // Filtro por Búsqueda (Nombre o Descripción)
        if (buscar) {
            query.$or = [
                { nombre: { $regex: buscar, $options: 'i' } },
                { descripcion: { $regex: buscar, $options: 'i' } }
            ];
        }

        // Filtro por Categoría
        if (categoria) {
            query.categoria = categoria;
        }

        const productos = await Product.find(query)
            .limit(limite)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            productos,
            totalPaginas: Math.ceil(total / limite),
            paginaActual: Number(pagina)
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
};

// CREAR PRODUCTO (Solo Admin)
exports.crearProducto = async (req, res) => {
    try {
        // Verificar si el usuario es admin (inyectado por el middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'No tienes permisos de administrador' });
        }

        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).send('Error al crear el producto');
    }
};

// ELIMINAR PRODUCTO (Solo Admin)
exports.eliminarProducto = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('No autorizado');
        
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
};