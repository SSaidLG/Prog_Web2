const express = require('express');
const mysql = require('mysql2/promise'); // Usamos promise para poder usar async/await
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite que tu frontend se comunique con este backend sin bloqueos
app.use(express.json()); // Nos permite recibir datos en formato JSON (ej. al crear un vehículo)

// Configuración de conexión a MySQL (Toma los datos del docker-compose.yml)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'fleetops_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear un "Pool" de conexiones (Más eficiente que crear una conexión por cada petición)
const pool = mysql.createPool(dbConfig);

// ==========================================
// RUTAS (ENDPOINTS)
// ==========================================

// 1. GET /api/vehicles -> Trae toda la lista de la flota para tu tabla
app.get('/api/vehicles', async (req, res) => {
    try {
        // Unimos Vehículos con Inspecciones para obtener la fecha de la última inspección
        const [rows] = await pool.query(`
            SELECT 
                v.id, 
                v.model, 
                v.license_plate, 
                v.category, 
                v.status, 
                v.fuel_level,
                MAX(i.inspection_date) as last_inspection
            FROM Vehicles v
            LEFT JOIN Inspections i ON v.id = i.vehicle_id
            GROUP BY v.id
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el inventario de vehículos' });
    }
});

// 2. GET /api/metrics -> Calcula los porcentajes para el Dashboard (Fleet Health)
app.get('/api/metrics', async (req, res) => {
    try {
        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM Vehicles');
        const [activeRows] = await pool.query('SELECT COUNT(*) as active FROM Vehicles WHERE status = "OPERATIVO"');
        const [maintenanceRows] = await pool.query('SELECT COUNT(*) as maintenance FROM Vehicles WHERE status = "MANTENIMIENTO"');
        
        const total = totalRows[0].total;
        const active = activeRows[0].active;
        const maintenance = maintenanceRows[0].maintenance;
        
        // Calculamos el porcentaje de salud (Fleet Health)
        const fleetHealth = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

        res.json({
            total_vehicles: total,
            active_vehicles: active,
            in_maintenance: maintenance,
            fleet_health_percentage: fleetHealth
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular las métricas' });
    }
});

// 3. POST /api/vehicles -> Añade un nuevo vehículo a la base de datos
app.post('/api/vehicles', async (req, res) => {
    const { id, model, license_plate, category, status, fuel_level } = req.body;
    try {
        await pool.query(
            'INSERT INTO Vehicles (id, model, license_plate, category, status, fuel_level) VALUES (?, ?, ?, ?, ?, ?)',
            [id, model, license_plate, category, status || 'OPERATIVO', fuel_level || 100]
        );
        res.status(201).json({ message: 'Vehículo añadido exitosamente', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir el vehículo. Verifica que el ID o Placa no estén repetidos.' });
    }
});

// 4. DELETE /api/vehicles/:id -> Elimina un vehículo
app.delete('/api/vehicles/:id', async (req, res) => {
    const vehicleId = req.params.id;
    try {
        await pool.query('DELETE FROM Vehicles WHERE id = ?', [vehicleId]);
        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
});

// Encender el servidor
app.listen(port, () => {
    console.log(`🚀 API de FleetOps corriendo exitosamente en http://localhost:${port}`);
});