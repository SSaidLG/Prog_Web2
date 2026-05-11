// Archivo: /backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Permite que el frontend se comunique con el backend
app.use(express.json()); // Permite recibir datos en formato JSON en las peticiones POST

// Importar la conexión a la base de datos (Solo para probar que funciona al arrancar)
const db = require('./config/db');

// --- NUEVO: Importar las rutas ---
const vehiculosRoutes = require('./routes/vehiculosRoutes');

// Ruta de prueba básica (Health Check)
app.get('/api/status', (req, res) => {
    res.json({ mensaje: 'API de FleetOps funcionando correctamente 🚀' });
});

// --- NUEVO: Usar las rutas en la API ---
// Todo lo que empiece con /api/vehiculos será manejado por vehiculosRoutes
app.use('/api/vehiculos', vehiculosRoutes);

// ==========================================
// RUTA DE MÉTRICAS (KPIs para Dashboards)
// ==========================================
app.get('/api/metrics', async (req, res) => {
    try {
        // Consultamos tu base de datos (con las tablas en español que creamos)
        const [totalRows] = await db.query('SELECT COUNT(*) as total FROM vehiculos');
        const [activeRows] = await db.query('SELECT COUNT(*) as active FROM vehiculos WHERE estado = "OPERATIVO"');
        const [maintenanceRows] = await db.query('SELECT COUNT(*) as maintenance FROM vehiculos WHERE estado IN ("MANTENIMIENTO", "FALLA CRITICA")');
        
        const total = totalRows[0].total;
        const active = activeRows[0].active;
        const maintenance = maintenanceRows[0].maintenance;
        
        // Calculamos el porcentaje de salud de la flota
        const fleetHealth = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

        res.json({
            total_vehicles: total,
            active_vehicles: active,
            in_maintenance: maintenance,
            fleet_health_percentage: fleetHealth
        });
    } catch (error) {
        console.error('Error en métricas:', error);
        res.status(500).json({ error: 'Error al calcular las métricas' });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`🔗 Prueba la conexión en: http://localhost:${PORT}/api/status`);
    console.log(`=========================================`);
});