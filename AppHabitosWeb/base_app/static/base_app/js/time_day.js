
// Obtén el elemento progress
let barraProgreso = document.querySelector('progress');
let textoProgreso = document.querySelector('.progress-text');

function Calcula_porcentaje_dia(){

        let ahora = new Date();
        let totalMinutosHoy = ahora.getHours() * 60 + ahora.getMinutes();
        let totalMinutosDia = 24 * 60;

        // Calcula el porcentaje del día que ha pasado
        let porcentajeDiaPasado = (totalMinutosHoy / totalMinutosDia) * 100;

        // Actualiza el valor de la barra de progreso
        barraProgreso.value = porcentajeDiaPasado;

        // Actualiza el texto con el porcentaje del día que ha pasado
        textoProgreso.textContent = porcentajeDiaPasado.toFixed(2) + '% del día';

        dia_porcentaje = document.getElementById('porcentaje_dia')
}

Calcula_porcentaje_dia()

// Actualiza la barra de progreso cada minuto
setInterval(() => {
    Calcula_porcentaje_dia()
}, 60000); // 60000 milisegundos equivalen a un minuto

