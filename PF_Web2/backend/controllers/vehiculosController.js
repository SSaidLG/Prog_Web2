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

// 2. CREACIÓN (POST)
const crearVehiculo = async (req, res) => {
    // Recibimos los datos que manda flota.js
    const { id, modelo, license_plate, category } = req.body; 
    
    try {
        // Hacemos el INSERT empatando con tus columnas en español
        await pool.query(
            'INSERT INTO vehiculos (id, modelo, placa, categoria, estado, nivel_combustible) VALUES (?, ?, ?, ?, ?, ?)',
            [id, modelo, license_plate, category, 'OPERATIVO', 100] // Por defecto lo ponemos Operativo y con 100% de tanque
        );
        res.status(201).json({ message: 'Vehículo añadido exitosamente' });
    } catch (error) {
        console.error('Error al insertar vehículo:', error.message);
        // El error más común aquí es que el ID o la Placa (que son UNIQUE) ya existan
        res.status(500).json({ error: 'Error al añadir el vehículo. Verifica duplicados.' });
    }
};

// 3. ELIMINACIÓN (DELETE)
const eliminarVehiculo = async (req, res) => {
    const { id } = req.params; // Capturamos el ID que viene en la URL (ej. /api/vehiculos/VAN-5567)
    
    try {
        await pool.query('DELETE FROM vehiculos WHERE id = ?', [id]);
        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar vehículo:', error.message);
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
};

// 4. ACTUALIZACIÓN (PUT)
const actualizarVehiculo = async (req, res) => {
    const { id } = req.params; // El ID actual del vehículo
    const { modelo, license_plate, category } = req.body; // Los nuevos datos
    
    try {
        await pool.query(
            'UPDATE vehiculos SET modelo = ?, placa = ?, categoria = ? WHERE id = ?',
            [modelo, license_plate, category, id]
        );
        res.json({ message: 'Vehículo actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar vehículo:', error.message);
        res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
};

// Exportamos todas las funciones
module.exports = {
    getVehiculos,
    crearVehiculo,
    eliminarVehiculo,
    actualizarVehiculo
};