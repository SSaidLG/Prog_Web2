// Archivo: /backend/routes/vehiculosRoutes.js
const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// Definimos que cuando alguien haga una petición GET a la raíz de esta ruta,
// se ejecute la función getVehiculos del controlador.
router.get('/', vehiculosController.getVehiculos);
router.post('/', vehiculosController.crearVehiculo);
router.delete('/:id', vehiculosController.eliminarVehiculo);
router.put('/:id', vehiculosController.actualizarVehiculo);

module.exports = router;