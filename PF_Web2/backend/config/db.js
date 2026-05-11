// Archivo: /backend/config/db.js
const mysql = require('mysql2/promise'); // Usamos promise para usar async/await
require('dotenv').config(); // Lee el archivo .env

// Creamos el Pool de conexiones usando las variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Importante para MAMP
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Máximo 10 conexiones simultáneas
    queueLimit: 0
});

// Comprobación inicial para asegurar que la conexión funciona al arrancar
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL (MAMP)');
        connection.release(); // Liberamos la conexión de prueba
    })
    .catch(error => {
        console.error('❌ Error conectando a la base de datos:', error.message);
    });

// Exportamos el pool para poder usarlo en los "controllers"
module.exports = pool;