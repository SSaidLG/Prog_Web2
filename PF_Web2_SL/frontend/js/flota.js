// Archivo: /frontend/js/flota.js

let listaVehiculos = []; // Guardamos los datos localmente para poder editarlos rápido
let vehiculosFiltrados = []; // Nueva lista para manejar los filtros
let modoEdicionId = null; // Nos dirá si estamos creando o editando

// Variables de Paginación y Filtros
let paginaActual = 1;
const itemsPorPagina = 4;
let estadoFiltroActual = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
    protegerVista();   // Si no hay sesion, manda al login
    inicializarUI();   // Muestra el usuario y activa el boton de salir
    cargarVehiculos();
    configurarBotonesFiltro();
    cargarMetricasFlota();
});

async function cargarMetricasFlota() {
    try {
        const respuesta = await fetchConToken('/api/metrics');
        if (respuesta.ok) {
            const datos = await respuesta.json();
            document.getElementById('flota-health-kpi').innerText = datos.fleet_health_percentage + '%';
            document.getElementById('flota-queue-kpi').innerText = datos.in_maintenance;
        }
    } catch (error) {
        console.error('Error al cargar métricas de flota:', error);
    }
}

// ==========================================
// LECTURA (GET) Y RENDERIZADO
// ==========================================
async function cargarVehiculos() {
    try {
        const respuesta = await fetchConToken('/api/vehiculos');
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        listaVehiculos = await respuesta.json(); // Guardamos en la variable global
        aplicarFiltros(); // BUG FIX: pintar la tabla despues de cargar los datos

    } catch (error) {
        console.error('Error al cargar:', error);
        mostrarAlerta('No se pudieron cargar los datos del servidor', 'error');
    }
}

function configurarBotonesFiltro() {
    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Cambiar estilos de los botones
            botones.forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary');
                b.classList.add('bg-surface-container', 'text-on-surface-variant');
            });
            e.target.classList.remove('bg-surface-container', 'text-on-surface-variant');
            e.target.classList.add('bg-primary', 'text-on-primary');

            // Aplicar el filtro
            estadoFiltroActual = e.target.getAttribute('data-status');
            aplicarFiltros();
        });
    });
}

function aplicarFiltros() {
    let categoriaFiltro = document.getElementById('filtro-categoria').value;
    
    // Parche de seguridad por si el HTML envía el texto en lugar del valor
    if (categoriaFiltro === 'All Categories') categoriaFiltro = 'ALL';

    vehiculosFiltrados = listaVehiculos.filter(v => {
        // Filtro por Categoría
        const cumpleCategoria = categoriaFiltro === 'ALL' || v.categoria === categoriaFiltro;
        
        // Filtro por Estado
        let cumpleEstado = true;
        if (estadoFiltroActual === 'ACTIVE') {
            cumpleEstado = v.estado === 'OPERATIVO';
        } else if (estadoFiltroActual === 'SERVICE') {
            cumpleEstado = ['EN RUTA', 'CARGANDO'].includes(v.estado);
        } else if (estadoFiltroActual === 'ALERT') {
            cumpleEstado = ['MANTENIMIENTO', 'FALLA CRITICA'].includes(v.estado);
        }

        return cumpleCategoria && cumpleEstado;
    });

    paginaActual = 1; 
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById('vehiculos-tbody');
    tbody.innerHTML = ''; 

    // Lógica Matemática de Paginación
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const vehiculosPagina = vehiculosFiltrados.slice(inicio, fin);

    // Iteramos sobre vehiculosPagina, no sobre la lista global
    vehiculosPagina.forEach(vehiculo => {
        let badgeStyles = '', iconoEstado = '';
        switch(vehiculo.estado) {
            case 'OPERATIVO': badgeStyles = 'bg-emerald-500/10 text-emerald-700'; iconoEstado = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>'; break;
            case 'MANTENIMIENTO': badgeStyles = 'bg-secondary-container text-on-secondary-container'; iconoEstado = '<span class="material-symbols-outlined text-[14px] mr-1">warning</span>'; break;
            case 'FALLA CRITICA': badgeStyles = 'bg-error text-on-error'; break;
            default: badgeStyles = 'bg-surface-container-high text-on-surface';
        }

        const iconoVehiculo = vehiculo.categoria === 'Heavy Duty Truck' ? 'local_shipping' : vehiculo.categoria === 'Electric Van' ? 'electric_rickshaw' : 'airport_shuttle';

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
                    ${iconoEstado}${vehiculo.estado}
                </span>
            </td>
            <td class="px-lg py-md text-right">
                <div class="flex justify-end gap-sm">
                    <button onclick="abrirModal('${vehiculo.id}')" class="p-2 hover:bg-surface-container text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button>
                    <button onclick="eliminarVehiculo('${vehiculo.id}')" class="p-2 hover:bg-error-container text-error transition-colors"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // CORRECCIÓN: Esta es la línea mágica que revivirá tu paginación
    actualizarControlesPaginacion();
}

function actualizarControlesPaginacion() {
    const totalItems = vehiculosFiltrados.length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
    const inicioTexto = totalItems === 0 ? 0 : ((paginaActual - 1) * itemsPorPagina) + 1;
    const finTexto = Math.min(paginaActual * itemsPorPagina, totalItems);

    document.getElementById('info-paginacion').innerText = `Showing ${inicioTexto} to ${finTexto} of ${totalItems} vehicles`;

    const controles = document.getElementById('controles-paginacion');
    controles.innerHTML = '';

    // Botón Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50';
    btnAnterior.innerHTML = '<span class="material-symbols-outlined text-body-sm">chevron_left</span>';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => { paginaActual--; renderizarTabla(); };
    controles.appendChild(btnAnterior);

    // Números de Página
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        if (i === paginaActual) {
            btn.className = 'w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary rounded text-body-sm font-bold';
        } else {
            btn.className = 'w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors text-body-sm';
        }
        btn.innerText = i;
        btn.onclick = () => { paginaActual = i; renderizarTabla(); };
        controles.appendChild(btn);
    }

    // Botón Siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = 'w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50';
    btnSiguiente.innerHTML = '<span class="material-symbols-outlined text-body-sm">chevron_right</span>';
    btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    btnSiguiente.onclick = () => { paginaActual++; renderizarTabla(); };
    controles.appendChild(btnSiguiente);
}

// ==========================================
// MODAL Y FORMULARIO (POST / PUT)
// ==========================================

function abrirModal(idVehiculo = null) {
    const modal = document.getElementById('modal-vehiculo');
    const form = document.getElementById('form-vehiculo');
    const titulo = modal.querySelector('h3');
    const botonSubmit = form.querySelector('button[type="submit"]');
    const inputId = document.getElementById('v-id');

    form.reset(); // Limpiamos siempre al abrir

    if (idVehiculo) {
        // MODO EDICIÓN
        modoEdicionId = idVehiculo;
        titulo.textContent = 'Editar Vehículo';
        botonSubmit.textContent = 'Actualizar Datos';
        
        // Buscamos los datos en nuestra lista global y llenamos los campos
        const vehiculo = listaVehiculos.find(v => v.id === idVehiculo);
        inputId.value = vehiculo.id;
        inputId.disabled = true; // El ID (Placa/Clave) no se debería poder cambiar
        inputId.classList.add('bg-surface-container', 'opacity-70'); // Damos estilo visual de bloqueado

        document.getElementById('v-modelo').value = vehiculo.modelo;
        document.getElementById('v-placa').value = vehiculo.placa;
        document.getElementById('v-categoria').value = vehiculo.categoria;
    } else {
        // MODO CREACIÓN
        modoEdicionId = null;
        titulo.textContent = 'Añadir Nuevo Vehículo';
        botonSubmit.textContent = 'Guardar Vehículo';
        inputId.disabled = false;
        inputId.classList.remove('bg-surface-container', 'opacity-70');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function cerrarModal() {
    const modal = document.getElementById('modal-vehiculo');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function guardarVehiculo(evento) {
    evento.preventDefault();

    const vehiculoData = {
        id: document.getElementById('v-id').value,
        modelo: document.getElementById('v-modelo').value,
        license_plate: document.getElementById('v-placa').value,
        category: document.getElementById('v-categoria').value
    };

    try {
        let url = '/api/vehiculos';
        let method = 'POST';

        // Si estamos en modo edición, cambiamos la URL y el método
        if (modoEdicionId) {
            url = `/api/vehiculos/${modoEdicionId}`;
            method = 'PUT';
        }

        const respuesta = await fetchConToken(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculoData)
        });

        if (!respuesta.ok) throw new Error('Error en la petición');

        cerrarModal();
        cargarVehiculos();
        mostrarAlerta(modoEdicionId ? 'Vehículo actualizado correctamente' : 'Vehículo registrado con éxito', 'exito');
        
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Ocurrió un error al guardar los datos', 'error');
    }
}

// ==========================================
// ELIMINACIÓN (DELETE)
// ==========================================

async function eliminarVehiculo(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el vehículo ${id}?`)) {
        try {
            const respuesta = await fetchConToken(`/api/vehiculos/${id}`, { method: 'DELETE' });
            if (!respuesta.ok) throw new Error('Error al eliminar');

            cargarVehiculos();
            mostrarAlerta('Vehículo eliminado del sistema', 'exito');
            
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('No se pudo eliminar el vehículo', 'error');
        }
    }
}

// ==========================================
// SISTEMA DE ALERTAS (TOASTS)
// ==========================================

function mostrarAlerta(mensaje, tipo = 'exito') {
    const contenedor = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Estilos dependiendo de si es éxito o error
    const colores = tipo === 'exito' 
        ? 'bg-on-tertiary-container text-white' 
        : 'bg-error text-white';
    const icono = tipo === 'exito' ? 'check_circle' : 'error';

    toast.className = `flex items-start gap-md p-md rounded shadow-xl transform transition-all duration-500 translate-y-10 opacity-0 ${colores}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icono}</span>
        <div>
            <p class="text-body-sm font-bold">${mensaje}</p>
        </div>
    `;

    contenedor.appendChild(toast);

    // Animación de entrada
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Autodestrucción después de 3.5 segundos
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 500); // Espera a que termine de desvanecerse para borrarlo del HTML
    }, 3500);
}
// ==========================================
// EXPORTACION (CSV / PDF)
// Exporta los vehiculos actualmente visibles (respeta los filtros activos).
// ==========================================

// Mostrar / ocultar el menu de exportar
function toggleMenuExportar() {
    const menu = document.getElementById('menu-exportar');
    menu.classList.toggle('hidden');
}

// Cerrar el menu si se hace clic fuera de el
document.addEventListener('click', (e) => {
    const menu = document.getElementById('menu-exportar');
    const boton = document.getElementById('btn-exportar');
    if (menu && !menu.classList.contains('hidden') &&
        !menu.contains(e.target) && !boton.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Decide que lista exportar: la filtrada si hay filtros, si no, toda la flota
function obtenerDatosParaExportar() {
    const datos = (vehiculosFiltrados && vehiculosFiltrados.length > 0)
        ? vehiculosFiltrados
        : listaVehiculos;
    return datos || [];
}

// --- Exportar a CSV ---
function exportarCSV() {
    document.getElementById('menu-exportar').classList.add('hidden');
    const datos = obtenerDatosParaExportar();

    if (datos.length === 0) {
        mostrarAlerta('No hay vehiculos para exportar', 'error');
        return;
    }

    // Encabezados de las columnas
    const encabezados = ['ID', 'Modelo', 'Placa', 'Categoria', 'Estado', 'Combustible (%)', 'Operador'];

    // Funcion para "escapar" un valor (por si tiene comas o comillas)
    const escapar = (valor) => {
        const texto = (valor === null || valor === undefined) ? '' : String(valor);
        if (texto.includes(',') || texto.includes('"') || texto.includes('\n')) {
            return '"' + texto.replace(/"/g, '""') + '"';
        }
        return texto;
    };

    // Construimos las filas
    const filas = datos.map(v => [
        v.id, v.modelo, v.placa, v.categoria, v.estado,
        v.nivel_combustible, v.operador
    ].map(escapar).join(','));

    // Unimos todo. El \ufeff (BOM) hace que Excel abra bien los acentos.
    const contenidoCSV = '\ufeff' + [encabezados.join(','), ...filas].join('\n');

    // Creamos un archivo y lo descargamos
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    const fecha = new Date().toISOString().slice(0, 10);
    enlace.href = url;
    enlace.download = `flota_fleetops_${fecha}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);

    mostrarAlerta(`${datos.length} vehiculos exportados a CSV`, 'exito');
}

// --- Exportar a PDF (usando la ventana de impresion del navegador) ---
function exportarPDF() {
    document.getElementById('menu-exportar').classList.add('hidden');
    const datos = obtenerDatosParaExportar();

    if (datos.length === 0) {
        mostrarAlerta('No hay vehiculos para exportar', 'error');
        return;
    }

    const fecha = new Date().toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Construimos las filas de la tabla en HTML
    const filasHTML = datos.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.modelo}</td>
            <td>${v.placa}</td>
            <td>${v.categoria}</td>
            <td>${v.estado}</td>
            <td style="text-align:center">${v.nivel_combustible}%</td>
            <td>${v.operador || '-'}</td>
        </tr>
    `).join('');

    // Abrimos una ventana nueva con un documento listo para imprimir/guardar como PDF
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Reporte de Flota - FleetOps</title>
            <style>
                * { font-family: Arial, Helvetica, sans-serif; }
                body { padding: 32px; color: #0f1c2b; }
                .encabezado { display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 3px solid #041627; padding-bottom: 16px; margin-bottom: 24px; }
                h1 { color: #041627; margin: 0; font-size: 22px; letter-spacing: 1px; }
                .sub { color: #fd8b00; font-weight: bold; font-size: 11px; letter-spacing: 2px;
                    text-transform: uppercase; }
                .fecha { font-size: 12px; color: #44474c; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #041627; color: #fff; text-align: left; padding: 8px 10px;
                    text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
                td { padding: 8px 10px; border-bottom: 1px solid #c4c6cd; }
                tr:nth-child(even) td { background: #eef4ff; }
                .pie { margin-top: 24px; font-size: 10px; color: #74777d; text-align: center;
                    border-top: 1px solid #c4c6cd; padding-top: 12px; }
            </style>
        </head>
        <body>
            <div class="encabezado">
                <div>
                    <p class="sub">Global Logistics - Terminal A-12</p>
                    <h1>FleetOps Command</h1>
                </div>
                <div class="fecha">Reporte generado:<br><strong>${fecha}</strong></div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Modelo</th><th>Placa</th><th>Categoria</th>
                        <th>Estado</th><th>Comb.</th><th>Operador</th>
                    </tr>
                </thead>
                <tbody>${filasHTML}</tbody>
            </table>
            <div class="pie">
                Total de vehiculos: ${datos.length} &nbsp;|&nbsp; FleetOps Command &copy; 2026
            </div>
        </body>
        </html>
    `);
    ventana.document.close();

    // Esperamos a que cargue y abrimos el dialogo de impresion ("Guardar como PDF")
    ventana.onload = () => {
        ventana.focus();
        ventana.print();
    };

    mostrarAlerta('Generando PDF... usa "Guardar como PDF" en el dialogo', 'exito');
}
