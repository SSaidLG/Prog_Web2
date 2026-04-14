const h1 = document.querySelector('#tituloID1');
console.log(h1);
console.log(h1.id);
console.log(h1.className);
console.log(h1.innerText);
console.log(h1.textContent);
console.log(h1.tagName);
//  modificar la etiqueta h1
h1.textContent = 'Nuevo título';
h1.style.color = 'red';
h1.style.fontSize = '40px';
h1.style.textTransform = 'uppercase';
h1.style.textAlign = 'center';
h1.style.backgroundColor = 'yellow';
h1.style.padding = '20px';
h1.style.borderRadius = '10px';
h1.style.border = '2px solid black';
h1.style.width = '400px';
h1.style.margin = '20px auto';
