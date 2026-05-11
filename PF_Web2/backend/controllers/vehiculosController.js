// Archivo: /backend/controllers/vehiculosController.js
const pool = require('../config/db');

// Función para obtener todos los vehículos
const getVehiculos = async (req, res) => {
    try {
        // Ejecutamos la consulta SQL a la tabla 'vehiculos'
        const [rows] = await pool.query('SELECT * FROM vehiculos');
        
        // Respondemos enviando los datos en formato JSON
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener vehículos:', error.message);
        res.status(500).json({ error: 'Error interno al consultar la base de datos' });
    }
};

module.exports = {
    getVehiculos
};