const boton = document.querySelector('#botonID1');
const parrafo = document.querySelector('#parrafoID1');

boton.addEventListener('click', () => {
    parrafo.textContent = 'Nuevo texto del párrafo';
});