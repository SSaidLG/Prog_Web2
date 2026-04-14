// 1. Seleccionamos los elementos del DOM
const boton = document.getElementById('btnGenerar');
const input = document.getElementById('numeroInput');
const contenedor = document.getElementById('contenedorListas');

// 2. Agregamos el Evento (Click)
boton.addEventListener('click', () => {
    // Limpiamos el contenedor antes de generar nuevas listas
    contenedor.innerHTML = "";

    // Obtenemos el valor del input y lo convertimos a número
    const cantidad = parseInt(input.value);

    // Validamos que sea un número válido
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa un número válido mayor a 0");
        return;
    }

    // 3. Estructura de Control (Bucle For)
    // Este bucle generará tantas listas como el usuario haya pedido
    for (let i = 1; i <= cantidad; i++) {
        
        // Creamos un título para la lista
        const titulo = document.createElement('h3');
        titulo.textContent = `Lista número ${i}`;
        
        // Creamos el elemento de lista (ul)
        const listaUl = document.createElement('ul');

        // (Opcional) Podemos agregar elementos dentro de cada lista
        for (let j = 1; j <= 3; j++) {
            const itemLi = document.createElement('li');
            itemLi.textContent = `Elemento ${j} de la lista ${i}`;
            listaUl.appendChild(itemLi);
        }

        // Agregamos todo al contenedor principal
        contenedor.appendChild(titulo);
        contenedor.appendChild(listaUl);
    }
});