// Archivo: /frontend/js/auth.js
// ==========================================
// MÓDULO DE AUTENTICACIÓN DEL FRONTEND
// Se encarga de: guardar el token, iniciar/cerrar sesión,
// proteger las vistas y hacer peticiones autenticadas.
// ==========================================

// La URL base del API. Como ahora el backend sirve el frontend,
// usamos rutas relativas ('') para que funcione en cualquier dispositivo/dominio.
const API_URL = '';

const TOKEN_KEY = 'fleetops_token';
const USER_KEY = 'fleetops_user';

// ------------------------------------------
// Guardar / leer / borrar la sesión
// ------------------------------------------
function guardarSesion(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function obtenerUsuario() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

function estaAutenticado() {
    // Hay sesión si existe un token guardado
    return !!obtenerToken();
}

// ------------------------------------------
// Iniciar sesión (llamado desde login.html)
// ------------------------------------------
async function iniciarSesion(email, password) {
    try {
        const respuesta = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            return { ok: false, error: datos.error };
        }

        // Guardamos el token y los datos del usuario
        guardarSesion(datos.token, datos.usuario);
        return { ok: true, usuario: datos.usuario };
    } catch (error) {
        return { ok: false, error: 'Error de conexión con el servidor' };
    }
}

// ------------------------------------------
// Cerrar sesión
// ------------------------------------------
function cerrarSesion() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = './login.html';
}

// ------------------------------------------
// Proteger una vista.
// Se llama al inicio de cada página privada (dashboard, flota, etc).
// Si no hay sesión, redirige al login.
// ------------------------------------------
function protegerVista() {
    if (!estaAutenticado()) {
        window.location.href = './login.html';
    }
}

// ------------------------------------------
// fetch con token incluido automáticamente.
// Úsalo en lugar de fetch() para todas las peticiones al API protegido.
// Si el token expiró (401/403), cierra la sesión y manda al login.
// ------------------------------------------
async function fetchConToken(url, opciones = {}) {
    const token = obtenerToken();

    const cabeceras = {
        ...(opciones.headers || {}),
        'Authorization': `Bearer ${token}`
    };

    const respuesta = await fetch(url, { ...opciones, headers: cabeceras });

    // Si el token ya no es válido, cerramos sesión automáticamente
    if (respuesta.status === 401 || respuesta.status === 403) {
        cerrarSesion();
        throw new Error('Sesión expirada');
    }

    return respuesta;
}

// ------------------------------------------
// Mostrar el nombre del usuario y conectar el botón de cerrar sesión.
// Se ejecuta automáticamente en las vistas protegidas.
// ------------------------------------------
function inicializarUI() {
    const usuario = obtenerUsuario();

    // Rellenar cualquier elemento con el atributo data-user-nombre
    if (usuario) {
        document.querySelectorAll('[data-user-nombre]').forEach(el => {
            el.textContent = usuario.nombre;
        });
        document.querySelectorAll('[data-user-email]').forEach(el => {
            el.textContent = usuario.email;
        });
    }

    // Conectar todos los botones/enlaces de cerrar sesión (atributo data-logout)
    document.querySelectorAll('[data-logout]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    });
}
