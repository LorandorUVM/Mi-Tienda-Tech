const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Obtener token de los headers
    let token = req.header('x-auth-token') || req.header('Authorization');

    // 2. Limpiar el prefijo 'Bearer ' si existe
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    // 3. Si no hay token, denegar acceso
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    try {
        // 4. Verificar el token
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = cifrado.user || cifrado; 
        
        next();
    } catch (error) {
        console.error("Error en validación de token:", error.message);
        res.status(401).json({ msg: 'Token no válido' });
    }
};