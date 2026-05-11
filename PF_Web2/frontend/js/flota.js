// Archivo: /frontend/js/flota.js

document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
});

// Función para obtener los datos de nuestra API
async function cargarVehiculos() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/vehiculos');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const vehiculos = await respuesta.json();
        renderizarTabla(vehiculos);
    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
        // Aquí después podemos agregar un mensaje visual de error para el usuario
    }
}

// Función para dibujar las filas en el HTML
function renderizarTabla(vehiculos) {
    const tbody = document.getElementById('vehiculos-tbody');
    tbody.innerHTML = ''; // Limpiamos por si acaso

    vehiculos.forEach(vehiculo => {
        // Determinamos los estilos del badge (etiqueta de estado)
        let badgeStyles = '';
        let iconoEstado = '';

        switch(vehiculo.estado) {
            case 'OPERATIVO':
                badgeStyles = 'bg-emerald-500/10 text-emerald-700';
                iconoEstado = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>';
                break;
            case 'MANTENIMIENTO':
                badgeStyles = 'bg-secondary-container text-on-secondary-container';
                iconoEstado = '<span class="material-symbols-outlined text-[14px] mr-1">warning</span>';
                break;
            case 'FALLA CRITICA':
                badgeStyles = 'bg-error text-on-error';
                iconoEstado = '';
                break;
            default:
                badgeStyles = 'bg-surface-container-high text-on-surface';
                iconoEstado = '';
        }

        // Determinamos el ícono del tipo de vehículo
        const iconoVehiculo = vehiculo.categoria === 'Heavy Duty Truck' ? 'local_shipping' : 
                              vehiculo.categoria === 'Electric Van' ? 'electric_rickshaw' : 'airport_shuttle';

        // Creamos la fila
        const tr = document.createElement('tr');
        tr.className = 'border-b border-outline-variant hover:bg-surface-container-low transition-colors';
        
        tr.innerHTML = `
            <td class="px-lg py-md font-data-tabular text-primary border-r border-outline-variant bg-surface-container-lowest">${vehiculo.id}</td>
            <td class="px-lg py-md flex items-center gap-md">
                <div class="w-10 h-10 bg-surface-container-high flex items-center justify-center rounded">
                    <span class="material-symbols-outlined text-primary">${iconoVehiculo}</span>
                </div>
                <span class="font-bold">${vehiculo.modelo}</span>
            </td>
            <td class="px-lg py-md font-data-tabular">${vehiculo.placa}</td>
            <td class="px-lg py-md">
                <span class="inline-flex items-center px-sm py-xs rounded ${badgeStyles} font-bold text-[11px] uppercase">
                    ${iconoEstado}
                    ${vehiculo.estado}
                </span>
            </td>
            <td class="px-lg py-md text-right">
                <div class="flex justify-end gap-sm">
                    <button class="p-2 hover:bg-surface-container text-primary transition-colors">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button onclick="eliminarVehiculo('${vehiculo.id}')" class="p-2 hover:bg-error-container text-error transition-colors">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Función preparada para cuando implementemos el botón de borrar
function eliminarVehiculo(id) {
    console.log("Próximamente eliminaremos el vehículo:", id);
    // Aquí pondremos el fetch con el método DELETE
}