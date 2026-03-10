// Adivina un número del 1-10

let numeroSecreto = Math.floor(Math.random() * 10) + 1;

let intento = parseInt(prompt("Adivina el número del 1 al 10"));

// Verificar resultado
if (intento === numeroSecreto) {
    console.log("¡Felicidades! Adivinaste el número");
} else {
    console.log("No adivinaste. El número era: " + numeroSecreto);
}