// console.log(document.querySelector("#tituloID1"));

// console.log(document.querySelector(".tituloClass1"));

//console.log(document.querySelector("h1"));

//console.log(document.querySelectorAll("h1"));
//console.log(document.querySelectorAll(".tituloClass1"));    

// console.log(document.querySelector("#tituloID1").textContent);
// console.log(document.querySelector("#tituloID2").textContent);
// console.log(document.querySelector("#tituloID3").textContent);
let titulo1 = document.querySelector("#tituloID1");
let titulo2 = document.querySelector("#tituloID2");
let titulo3 = document.querySelector("#tituloID3");

console.log(titulo1.textContent);
console.log(titulo2.textContent);
console.log(titulo3.textContent);

titulo1.textContent = "Nuevo titulo 1";
titulo2.textContent = "Nuevo titulo 2";
titulo3.textContent = "Nuevo titulo 3";