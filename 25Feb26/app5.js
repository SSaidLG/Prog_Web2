// //Operadores Lógicos
// && Ambos tienen que ser v para true
// || Al menos uno tiene que ser v para true
// ! negacion

// var compara = 5 > 2 && 6 !== 8;
// console.log(compara);


console.log("Validar tablas de verdad para operadores AND y OR");
console.log("AND:")

var compara = 4 < 2 && 3 > 4;
console.log(compara);

var compara = 4 > 2 && 3 > 4;
console.log(compara);

var compara = 4 < 2 && 3 < 4;
console.log(compara);

var compara = 4 > 2 && 3 < 4;
console.log(compara);

console.log("OR:")

var compara = 4 < 2 || 3 > 4;
console.log(compara);

var compara = 4 > 2 || 3 > 4;
console.log(compara);

var compara = 4 < 2 || 3 < 4;
console.log(compara);

var compara = 4 > 2 || 3 < 4;
console.log(compara);