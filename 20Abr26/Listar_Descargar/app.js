// Variables y referencias al DOM
const form = document.getElementById('userForm');
const contenedor = document.getElementById('contenedorUsuarios');
const descargarBtn = document.getElementById('descargarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');

// Inicializar el arreglo de usuarios desde localStorage
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Mostrar los usuarios al cargar la página
mostrarUsuarios();

// Evento para enviar datos desde el formulario
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('correo').value.trim();

    // Crear un objeto con ID único para facilitar la edición/borrado
    const nuevoUsuario = {
        id: Date.now(), // Usamos timestamp como ID único
        nombre: nombre,
        email: email
    };

    usuarios.push(nuevoUsuario);
    guardarYActualizar();
    form.reset();
});

// Función para mostrar usuarios con opción de edición
function mostrarUsuarios() {
    contenedor.innerHTML = '';

    if (usuarios.length === 0) {
        contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }

    usuarios.forEach((user, index) => {
        const div = document.createElement('div');
        div.className = 'usuario-card';
        div.innerHTML = `
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Nombre:</strong> <span class="editable" contenteditable="true" onblur="actualizarDato(${index}, 'nombre', this.textContent)">${user.nombre}</span></p>
            <p><strong>Correo:</strong> <span class="editable" contenteditable="true" onblur="actualizarDato(${index}, 'email', this.textContent)">${user.email}</span></p>
            <button class="btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

// Función para actualizar datos específicos (Edición)
function actualizarDato(index, campo, nuevoValor) {
    const valorLimpio = nuevoValor.trim();
    if (valorLimpio !== "") {
        usuarios[index][campo] = valorLimpio;
        guardarYActualizar();
    } else {
        mostrarUsuarios(); // Recargar para restaurar valor si se dejó vacío
    }
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
    if (confirm('¿Eliminar este usuario?')) {
        usuarios.splice(index, 1);
        guardarYActualizar();
    }
}

// Función auxiliar para centralizar el guardado
function guardarYActualizar() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarUsuarios();
}

// Evento para descargar el JSON
descargarBtn.addEventListener('click', function () {
    if (usuarios.length === 0) return alert("No hay datos");
    
    const contenidoJSON = JSON.stringify(usuarios, null, 2);
    const blob = new Blob([contenidoJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_local.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Botón extra para limpiar LocalStorage
limpiarBtn.addEventListener('click', () => {
    if (confirm('¿Borrar todos los datos de LocalStorage?')) {
        usuarios = [];
        localStorage.removeItem('usuarios');
        mostrarUsuarios();
    }
});