const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    try {
        // Verificar que el usuario sea único
        let usuario = await User.findOne({ email });
        if (usuario) return res.status(400).json({ msg: 'El usuario ya existe' });

        usuario = new User({ nombre, apellido, email, password });

        // Encriptar password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // Guardar
        await usuario.save();

        // Crear y firmar el JWT
        const payload = { user: { id: usuario.id, role: usuario.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (error, token) => {
            if (error) throw error;
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al registrar');
    }
};

exports.autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ msg: 'Usuario no existe' });

        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passCorrecto) return res.status(400).json({ msg: 'Password incorrecto' });

        const payload = { user: { id: usuario.id, role: usuario.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (error, token) => {
            if (error) throw error;
            res.json({ token, user: { nombre: usuario.nombre, role: usuario.role } });
        });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};