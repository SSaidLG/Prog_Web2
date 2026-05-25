// Archivo: /backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// La clave secreta para firmar los tokens. Viene del .env (con un valor por defecto por si acaso).
const JWT_SECRET = process.env.JWT_SECRET || 'fleetops_secret_dev';
const JWT_EXPIRES = '8h'; // El token dura 8 horas (una jornada laboral)

// ==========================================
// LOGIN -> POST /api/auth/login
// ==========================================
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validación básica de entrada
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        // 1. Buscamos al usuario por su email
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length === 0) {
            // Por seguridad, no decimos si fue el email o la contraseña lo que falló
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const usuario = rows[0];

        // 2. Comparamos la contraseña enviada con el hash guardado
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // 3. Si todo está bien, generamos un token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        // 4. Devolvemos el token y algunos datos del usuario (nunca el hash)
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ==========================================
// REGISTRO -> POST /api/auth/register
// (Opcional: para poder crear más usuarios)
// ==========================================
const register = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Hasheamos la contraseña antes de guardarla (10 rondas de sal)
        const password_hash = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
            [nombre, email, password_hash]
        );

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        // El error más común es email duplicado (campo UNIQUE)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ese email ya está registrado' });
        }
        console.error('Error en registro:', error.message);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// ==========================================
// VERIFICAR SESIÓN -> GET /api/auth/me
// Sirve para que el frontend confirme que el token sigue siendo válido
// ==========================================
const obtenerPerfil = async (req, res) => {
    // req.usuario lo inyecta el middleware verificarToken
    res.json({ usuario: req.usuario });
};

module.exports = { login, register, obtenerPerfil };
