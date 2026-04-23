// arreglo donde se guardan los productos que el cliente va agregando al carrito de compras
const carrito = [];

// definimos la clase producto donde se definen los productos que se van a vender en la tienda
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}
// funcion para agregar productos al carrito de compras
function agregarProducto(carrito, producto,cantidad) {
    // buscamos si el producto ya esta en el carrito de compras
    const indice = carrito.findIndex((item) => item.producto.nombre === producto.nombre);
    if (indice !== -1) {
        // si el producto ya esta en el carrito de compras, se actualiza la cantidad
        carrito[indice].cantidad += cantidad;
    } else {
        // si el producto no esta en el carrito de compras, se agrega al carrito de compras
        carrito.push({ producto, cantidad: cantidad });
    }
    // actualziar la vista del carrito de compras
    mostrarCarrito(carrito);
}
// funcion para mostrar el carrito de compras

function mostrarCarrito(carrito) {
    const listaCarrito = document.getElementById("carrito");
    listaCarrito.innerHTML = ""; // limpiar el carrito de compras para mostrar los productos actualizados
    
    carrito.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.producto.nombre} - $${item.producto.precio} x ${item.cantidad}`;
        listaCarrito.appendChild(li);
    });
}

// eventos para agregar productos al carrito de compras
document.getElementById("formulario").addEventListener('submit', 
    function (event){
        event.preventDefault(); // evitar que el formulario se envie y se recargue la pagina
        const nombreProducto = document.getElementById("nombre").value.trim();
        const precioProducto = parseFloat(document.getElementById("precio").value);
        const cantidadProducto = parseInt(document.getElementById("cantidad").value);
        // crear un nuevo objeto producto con los valores del formulario
        const producto = new Producto(nombreProducto, precioProducto);
        // agregar el producto al carrito de compras
        agregarProducto(carrito, producto, cantidadProducto);
        // limpiar el formulario despues de agregar el producto al carrito de compras
        document.getElementById("formulario").reset();
        
    } );