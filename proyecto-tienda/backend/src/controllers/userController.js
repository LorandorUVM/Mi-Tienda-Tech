const User = require('../models/User');

// --- PERFIL DEL USUARIO LOGGEADO ---

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, direccion, telefono } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nombre, apellido, direccion, telefono },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    }
};

// --- FAVORITOS ---

const toggleFavorito = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { productoId } = req.body;

        if (user.favoritos.includes(productoId)) {
            user.favoritos = user.favoritos.filter(id => id.toString() !== productoId);
        } else {
            user.favoritos.push(productoId);
        }
        await user.save();
        res.json(user.favoritos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar favorito" });
    }
};

// --- ADMINISTRACIÓN (Solo Admin) ---

// Ver todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

// Editar CUALQUIER usuario por ID (Requisito Rúbrica)
const adminUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, role, telefono, direccion } = req.body;
        
        const user = await User.findByIdAndUpdate(
            id,
            { nombre, apellido, email, role, telefono, direccion },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar el usuario' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    toggleFavorito,
    getAllUsers,
    adminUpdateUser
};