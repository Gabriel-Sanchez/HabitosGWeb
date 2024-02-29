
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


