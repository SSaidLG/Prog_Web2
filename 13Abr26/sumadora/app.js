document.getElementById("sumForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página

    // Obtener los valores de los campos de entrada
    const num1 = parseFloat(document.getElementById("num1").value.trim());
    const num2 = parseFloat(document.getElementById("num2").value.trim());

    // Realizar la suma
    const sum = num1 + num2;

    // Mostrar el resultado
    document.getElementById("resultado").textContent = sum;
});