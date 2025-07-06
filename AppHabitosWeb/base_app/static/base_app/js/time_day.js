// Obtén los elementos progress
let barraProgresoDia = document.querySelector('#progress-dia');
let barraProgresoTareas = document.querySelector('#progress-tareas');
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

    // Actualiza solo el valor de la barra de progreso del día
    if (barraProgresoDia) {
        barraProgresoDia.value = porcentajeDiaPasado;
    }
    
    // Actualizar el texto de la barra del día
    let textoDia = document.querySelector('.progress-text');
    if (textoDia) {
        textoDia.textContent = `${porcentajeDiaPasado.toFixed(1)}% del día`;
    }
}

// Inicializar la configuración del usuario al cargar la página
obtenerConfiguracionUsuario().then(() => {
    Calcula_porcentaje_dia();
});

// Función para calcular el progreso de las tareas
function actualizarProgresoTareas(horasCompletadas, tiempoRestante) {
    if (!barraProgresoTareas) return;
    
    // Convertir horas completadas a minutos
    let minutosCompletados = 0;
    if (horasCompletadas && horasCompletadas.Horas !== undefined && horasCompletadas.Minutos !== undefined) {
        minutosCompletados = (horasCompletadas.Horas * 60) + horasCompletadas.Minutos;
    }
    
    // Convertir tiempo restante a minutos
    let minutosRestantes = 0;
    if (tiempoRestante && tiempoRestante.Horas !== undefined && tiempoRestante.Minutos !== undefined) {
        minutosRestantes = (tiempoRestante.Horas * 60) + tiempoRestante.Minutos;
    }
    
    // Calcular total de minutos de tareas del día
    let totalMinutosTareas = minutosCompletados + minutosRestantes;
    
    // Calcular porcentaje de progreso
    let porcentajeProgreso = 0;
    if (totalMinutosTareas > 0) {
        porcentajeProgreso = (minutosCompletados / totalMinutosTareas) * 100;
    }
    
    // Actualizar barra de progreso
    barraProgresoTareas.value = porcentajeProgreso;
    
    // Actualizar texto de la barra de tareas
    let textoTareas = document.querySelector('.progress-text-tareas');
    if (textoTareas) {
        textoTareas.textContent = `${porcentajeProgreso.toFixed(1)}% tareas`;
    }
}

// Actualiza la barra de progreso cada minuto
setInterval(() => {
    Calcula_porcentaje_dia();
}, 60000);

