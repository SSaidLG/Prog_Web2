let productos =[
    {nombre: 'camisa',   precio: 300},
    {nombre: 'pantalon', precio: 550},
    {nombre: 'zapatos',  precio: 750},
    {nombre: 'sombrero', precio: 550},
    {nombre: 'tenis',    precio: 1200}
];
/*
que quieres comprar
1
2
3
4
5 total y lista
6 salir
*/
let carrito=[];
/*-funcion para mostrar el menu de productos mas 2 funciones-*/

function mostrarMenu(){
   let menu = "Seleccione un producto para agregar al carrito\n";

   for(let i = 0; i < productos.length; i++){
        menu += (i+1) + ".- " + productos[i].nombre + " - $" + productos[i].precio + "\n";
   } 

   menu += (productos.length+1) + ".- Agregar nuevo producto\n";
   menu += (productos.length+2) + ".- Ver carrito y Total\n";
   menu += (productos.length+3) + ".- Salir\n";

   return menu;
}


function agregarAlCarrito(index){  
    let productoSeleccionado = productos[index];
    carrito.push(productoSeleccionado);
    console.log(`Producto ${productoSeleccionado.nombre} se agregó al carrito`);

}
function mostrarCarritoTotaL(){
    if(carrito.length===0){

        console.log("El carrito esta vacio");
    }else{
        let mensajeCarrito ="Carrito de compras\n";
        let total = 0;
        for ( let i = 0; i<carrito.length;i++){
            mensajeCarrito+= (i+1)+" .- "+carrito[i].nombre+" - $"+carrito[i].precio+"\n";
            total+= carrito[i].precio;
        }
        mensajeCarrito+="\n Total: $"+total;
        console.log(mensajeCarrito);
    }
}
function agregarNuevoProducto(){
    let nombre = prompt("Ingrese el nombre del producto:");
    let precio = Number(prompt("Ingrese el precio del producto:"));

    if(nombre && !isNaN(precio) && precio > 0){
        productos.push({nombre: nombre, precio: precio});
        console.log("Producto agregado correctamente");
    }else{
        console.log("Datos inválidos");
    }
}
/*--Menu de inicio--*/ 
let opcion;
do{
    opcion = Number(prompt(mostrarMenu()));

    if(isNaN(opcion) || opcion < 1 || opcion > productos.length+3){
        console.log("Opción no válida");
    } 
    else if(opcion >= 1 && opcion <= productos.length){
        agregarAlCarrito(opcion-1);
    } 
    else if(opcion === productos.length+1){
        agregarNuevoProducto();
    }
    else if(opcion === productos.length+2){
        mostrarCarritoTotaL();
    }

} while(opcion !== productos.length+3);

console.log("Gracias por su compra :)");