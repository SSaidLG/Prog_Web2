// Archivo: /frontend/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    protegerVista();   // Si no hay sesion, manda al login
    inicializarUI();   // Muestra el nombre del usuario y activa el boton de salir
    cargarMetricas();
});

async function cargarMetricas() {
    try {
        // Usamos fetchConToken para enviar el token de sesion automaticamente
        const respuesta = await fetchConToken('/api/metrics');
        if (!respuesta.ok) throw new Error('Error al cargar metricas');

        const datos = await respuesta.json();

        // Actualizar HTML
        document.getElementById('kpi-active').innerText = datos.active_vehicles;
        document.getElementById('kpi-maintenance').innerText = datos.in_maintenance;
        document.getElementById('kpi-health').innerText = datos.fleet_health_percentage + '%';

        // Actualizar barra de progreso
        document.getElementById('bar-health').style.width = datos.fleet_health_percentage + '%';

    } catch (error) {
        console.error('Error de conexion:', error);
    }
}
