
function calcularTiempoTotal() {
    const type = parseInt(document.getElementById('type').value);
    const workTime = parseInt(document.getElementById('work_time').value) || 0;
    const shortBreak = parseInt(document.getElementById('short_break').value) || 0;
    const count = parseInt(document.getElementById('count').value) || 0;

    let tiempoTotal = 0;
    let label = '';

    switch(type) {
        case 1: // Pomodoro
            if (workTime > 0 && count > 0) {
                tiempoTotal = (workTime + shortBreak) * count - shortBreak; // Restar el último break
                const horas = Math.floor(tiempoTotal / 60);
                const minutos = tiempoTotal % 60;
                label = `Total: ${horas > 0 ? horas + 'h ' : ''}${minutos}m`;
            }
            break;
        case 2: // Checker
            label = 'Sin tiempo específico';
            break;
        case 3: // StopWatch
            label = 'Tiempo manual';
            break;
    }

    const labelElement = document.getElementById('tipo-tiempo-label');
    if (labelElement) {
        labelElement.textContent = label;
    }
}

let colorPalette = document.getElementById('colorPalette');
let colorDelHabito = document.getElementById('color_hab')
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink']; // Reemplaza estos colores con los de tu lista

let selectedColor;

colors.forEach(function(color) {
let colorDiv = document.createElement('div');
colorDiv.className = 'color';
colorDiv.style.backgroundColor = color;
colorDiv.addEventListener('click', function() {
selectedColor = color; // Guardar el color seleccionado
console.log('Color seleccionado:', selectedColor); // Imprimir el color seleccionado en la consola


var divsHijos = colorPalette.getElementsByTagName('div');

// Recorre cada div hijo y elimina el borde
for (var i = 0; i < divsHijos.length; i++) {
    divsHijos[i].style.border = "none";
}
colorDiv.style.border = '3px solid black'
colorDelHabito.value = selectedColor


});
colorPalette.appendChild(colorDiv);
});

// Agregar event listeners para actualizar el tiempo total cuando cambien los inputs
document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('type');
    const workTimeInput = document.getElementById('work_time');
    const shortBreakInput = document.getElementById('short_break');
    const countInput = document.getElementById('count');

    if (typeSelect) {
        typeSelect.addEventListener('change', calcularTiempoTotal);
    }
    if (workTimeInput) {
        workTimeInput.addEventListener('input', calcularTiempoTotal);
    }
    if (shortBreakInput) {
        shortBreakInput.addEventListener('input', calcularTiempoTotal);
    }
    if (countInput) {
        countInput.addEventListener('input', calcularTiempoTotal);
    }

    // Calcular tiempo inicial
    calcularTiempoTotal();
});


