// Archivo: /backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fleetops_secret_dev';

// Middleware que protege rutas: solo deja pasar si hay un token válido
const verificarToken = (req, res, next) => {
    // El token se envía en la cabecera:  Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Quitamos la palabra "Bearer"

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    try {
        // Verificamos que el token sea legítimo y no haya expirado
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // Guardamos los datos del usuario para usarlos en la ruta
        next(); // Todo bien, dejamos continuar
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;
