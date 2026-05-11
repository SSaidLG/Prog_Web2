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

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`🔗 Prueba la conexión en: http://localhost:${PORT}/api/status`);
    console.log(`=========================================`);
});