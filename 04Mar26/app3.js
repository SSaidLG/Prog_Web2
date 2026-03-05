let nombreUsuario="Said";
let estado = false;

if(estado){
    console.log(`Ganaste:  ${nombreUsuario}`);
}else{
    console.log(`Perdiste: ${nombreUsuario}`);
}
console.log("--------------------------");

console.log(`
${estado ? 'Ganaste: ': 'Perdiste: '} ${nombreUsuario}
    `);