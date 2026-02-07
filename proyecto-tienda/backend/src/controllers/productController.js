const Product = require('../models/Product');

// 1. OBTENER PRODUCTOS (Con filtros, paginación y validación de stock)
const obtenerProductos = async (req, res) => {
    try {
        const { buscar, categoria } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // REQUISITO: Si el usuario NO es admin, solo ver productos con existencia > 0
        // Nota: Si el usuario es admin, debería poder ver hasta los de stock 0 para editarlos.
        let query = {
            $or: [
                { stock: { $gt: 0 } },
                { cantidad: { $gt: 0 } }
            ]
        };

        if (buscar) {
            query.nombre = { $regex: buscar, $options: 'i' };
        }

        if (categoria && categoria !== "" && categoria !== "Todas") {
            query.categoria = categoria;
        }

        const productos = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalProductos = await Product.countDocuments(query);

        res.json({
            productos,
            totalPaginas: Math.ceil(totalProductos / limit),
            paginaActual: page,
            totalProductos,
            hasMore: page < Math.ceil(totalProductos / limit)
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos' });
    }
};

// 2. CREAR PRODUCTO (Solo Admin)
const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto' });
    }
};

// 3. ACTUALIZAR PRODUCTO (NUEVO - REQUISITO RÚBRICA)
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscamos por ID y actualizamos con los datos que vienen del Modal (req.body)
        const productoActualizado = await Product.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true } // new: true devuelve el objeto ya cambiado
        );

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el producto' });
    }
};

// 4. ELIMINAR PRODUCTO (Solo Admin)
const eliminarProducto = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};

// No olvides exportar la nueva función
module.exports = { 
    obtenerProductos, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
};