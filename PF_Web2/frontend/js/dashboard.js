// Archivo: /frontend/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    cargarMetricas();
});

async function cargarMetricas() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/metrics');
        if (!respuesta.ok) throw new Error('Error al cargar métricas');

        const datos = await respuesta.json();

        // Animar números y actualizar HTML
        document.getElementById('kpi-active').innerText = datos.active_vehicles;
        document.getElementById('kpi-maintenance').innerText = datos.in_maintenance;
        document.getElementById('kpi-health').innerText = datos.fleet_health_percentage + '%';

        // Actualizar barra de progreso
        document.getElementById('bar-health').style.width = datos.fleet_health_percentage + '%';

    } catch (error) {
        console.error('Error de conexión:', error);
    }
}