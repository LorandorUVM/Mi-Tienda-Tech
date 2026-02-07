const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 0 }, // min: 0 asegura coherencia
    imagen: { type: String, required: true },
    categoria: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);