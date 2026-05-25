// Archivo: /backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Permite que el frontend se comunique con el backend
app.use(express.json()); // Permite recibir datos en formato JSON en las peticiones POST

// Importar la conexión a la base de datos (Solo para probar que funciona al arrancar)
const db = require('./config/db');

// Importar las rutas
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const authRoutes = require('./routes/authRoutes');
const verificarToken = require('./middleware/authMiddleware');

// Ruta de prueba basica (Health Check) - publica
app.get('/api/status', (req, res) => {
    res.json({ mensaje: 'API de FleetOps funcionando correctamente' });
});

// --- Rutas de AUTENTICACION (login / registro) - publicas ---
app.use('/api/auth', authRoutes);

// --- Rutas de datos PROTEGIDAS ---
// Gracias a "verificarToken", nadie sin sesion puede leer ni modificar la flota.
app.use('/api/vehiculos', verificarToken, vehiculosRoutes);

// ==========================================
// RUTA DE METRICAS (KPIs para Dashboards) - protegida
// ==========================================
app.get('/api/metrics', verificarToken, async (req, res) => {
    try {
        const [totalRows] = await db.query('SELECT COUNT(*) as total FROM vehiculos');
        const [activeRows] = await db.query('SELECT COUNT(*) as active FROM vehiculos WHERE estado = "OPERATIVO"');
        const [maintenanceRows] = await db.query('SELECT COUNT(*) as maintenance FROM vehiculos WHERE estado IN ("MANTENIMIENTO", "FALLA CRITICA")');

        const total = totalRows[0].total;
        const active = activeRows[0].active;
        const maintenance = maintenanceRows[0].maintenance;

        const fleetHealth = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

        res.json({
            total_vehicles: total,
            active_vehicles: active,
            in_maintenance: maintenance,
            fleet_health_percentage: fleetHealth
        });
    } catch (error) {
        console.error('Error en metricas:', error);
        res.status(500).json({ error: 'Error al calcular las metricas' });
    }
});

// ==========================================
// SERVIR EL FRONTEND
// El backend tambien entrega los archivos HTML/JS/CSS.
// Asi todo corre en un solo contenedor y no hay problemas de CORS ni rutas.
// ==========================================
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// Si entran a la raiz "/", los mandamos al login
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log('=========================================');
    console.log('Servidor corriendo en el puerto ' + PORT);
    console.log('Abre la app en: http://localhost:' + PORT + '/login.html');
    console.log('=========================================');
});
