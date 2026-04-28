// Variables globales
let usuarios = [];

// Referencias al DOM
const form = document.getElementById('formUsuario');
const tabla = document.getElementById('tablaUsuarios');
const inputArchivo = document.getElementById('importarJSON');
const BtnDescargar = document.getElementById('descargarBtn');

// Generar ID único basado en el valor más alto existente
function generarID() {
    return usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
}

// Evento: Agregar Usuario
form.addEventListener('submit', function(e) { 
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('correo').value.trim();
    
    usuarios.push({ id: generarID(), nombre, email });
    mostrarUsuarios();
    form.reset();
}); 

// Mostrar usuarios en la tabla
function mostrarUsuarios() {
    tabla.innerHTML = '';
    
    usuarios.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td contenteditable="true" onblur="editarCampo(${index}, 'nombre', this.textContent)">${user.nombre}</td>
            <td contenteditable="true" onblur="editarCampo(${index}, 'email', this.textContent)">${user.email}</td>
            <td>
                <button onclick="eliminarUsuario(${index})" style="color: red;">Eliminar</button>
            </td>
        `;
        tabla.appendChild(row);
    });
}

// Función de edición (Corrección de Index y Campos)
function editarCampo(index, campo, valor) {
    const valorLimpio = valor.trim();
    
    // Solo actualizar si hay contenido real
    if (valorLimpio !== "") {
        usuarios[index][campo] = valorLimpio;
        console.log(`Usuario ${usuarios[index].id} actualizado: ${campo} = ${valorLimpio}`);
    } else {
        // Si dejan el campo vacío, restaurar el valor anterior recargando la tabla
        mostrarUsuarios();
    }
}

// Función de eliminación
function eliminarUsuario(index) {
    if(confirm('¿Estás seguro de eliminar este usuario?')) {
        usuarios.splice(index, 1);
        mostrarUsuarios();
    }
}

// Importación de JSON
inputArchivo.addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    
    lector.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            if (Array.isArray(datos)) {
                usuarios = datos;
                mostrarUsuarios();
            } else {
                alert('El archivo JSON debe contener un arreglo.');
            }
        } catch (error) {
            alert('Error al procesar el JSON: ' + error.message);
        }
    };
    lector.readAsText(archivo);
});

// Descarga de JSON
BtnDescargar.addEventListener('click', function() {
    if (usuarios.length === 0) {
        alert("No hay datos para descargar.");
        return;
    }
    const blob = new Blob([JSON.stringify(usuarios, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_registrados.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});