const listaDinamica = document.querySelector("#lista");

// crear un nuevo elemento
const li = document.createElement("li");
// agregar texto al nuevo elemento
li.textContent = "Elemento dinámico 1";
// agregar el nuevo elemento a la lista
listaDinamica.appendChild(li);

// crear otro elemento
const li2 = document.createElement("li");
li2.textContent = "Elemento dinámico 2";
listaDinamica.appendChild(li2);

// crear un tercer elemento
const li3 = document.createElement("li");
li3.textContent = "Elemento dinámico 3";
listaDinamica.appendChild(li3);