// Obtén el elemento progress
let barraProgreso = document.querySelector('progress');
let userEndOfDay = null;

// Función para obtener la configuración del usuario
async function obtenerConfiguracionUsuario() {
    try {
        const response = await fetch('/users/api/user-config/');
        const data = await response.json();
        if (data.status === 'success') {
            userEndOfDay = data.fin_dia;
        } else {
            userEndOfDay = '23:59'; // valor por defecto
        }
    } catch (error) {
        console.error('Error al obtener configuración del usuario:', error);
        userEndOfDay = '23:59'; // valor por defecto
    }
}

function Calcula_porcentaje_dia(){
    let ahora = new Date();
    let totalMinutosHoy = ahora.getHours() * 60 + ahora.getMinutes();
    
    // Usar la hora configurada del usuario
    let horaFinDia = userEndOfDay ? userEndOfDay : '23:59';
    let [horaFin, minutoFin] = horaFinDia.split(':').map(Number);
    let totalMinutosDia = horaFin * 60 + minutoFin;
    
    // Si el tiempo actual es después de la hora configurada, usar el día completo
    if (totalMinutosHoy > totalMinutosDia) {
        totalMinutosDia = 24 * 60; // 24 horas completas
    }

    // Calcula el porcentaje del día que ha pasado
    let porcentajeDiaPasado = (totalMinutosHoy / totalMinutosDia) * 100;

    // Actualiza solo el valor de la barra de progreso
    // El texto será controlado por lista_habito_script.js
    if (barraProgreso) {
        barraProgreso.value = porcentajeDiaPasado;
    }
}

// Inicializar la configuración del usuario al cargar la página
obtenerConfiguracionUsuario().then(() => {
    Calcula_porcentaje_dia();
});

// Actualiza la barra de progreso cada minuto
setInterval(() => {
    Calcula_porcentaje_dia();
}, 60000);

