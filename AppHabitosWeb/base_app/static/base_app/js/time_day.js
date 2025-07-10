// Obtén los elementos progress
let barraProgresoDia = document.querySelector('#progress-dia');
let barraProgresoTareas = document.querySelector('#progress-tareas');
let userStartOfDay = null;
let userEndOfDay = null;

// Función para obtener la configuración del usuario
async function obtenerConfiguracionUsuario() {
    try {
        const response = await fetch('/users/api/user-config/');
        const data = await response.json();
        if (data.status === 'success') {
            userStartOfDay = data.inicio_dia;
            userEndOfDay = data.fin_dia;
        } else {
            userStartOfDay = '00:00'; // valor por defecto
            userEndOfDay = '23:59'; // valor por defecto
        }
    } catch (error) {
        console.error('Error al obtener configuración del usuario:', error);
        userStartOfDay = '00:00'; // valor por defecto
        userEndOfDay = '23:59'; // valor por defecto
    }
}

function Calcula_porcentaje_dia(){
    let ahora = new Date();
    let minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    
    // Usar el horario configurado del usuario
    let horaInicioDia = userStartOfDay ? userStartOfDay : '00:00';
    let horaFinDia = userEndOfDay ? userEndOfDay : '23:59';
    
    let [horaInicio, minutoInicio] = horaInicioDia.split(':').map(Number);
    let [horaFin, minutoFin] = horaFinDia.split(':').map(Number);
    
    let minutosInicio = horaInicio * 60 + minutoInicio;
    let minutosFin = horaFin * 60 + minutoFin;
    
    // Calcular duración total del día personalizado
    let duracionDiaMinutos = minutosFin - minutosInicio;
    
    // Si la hora actual está antes del inicio del día, progreso 0%
    if (minutosActuales < minutosInicio) {
        porcentajeDiaPasado = 0;
    }
    // Si la hora actual está después del fin del día, progreso 100%
    else if (minutosActuales > minutosFin) {
        porcentajeDiaPasado = 100;
    }
    // Calcular progreso dentro del rango personalizado
    else {
        let minutosTranscurridos = minutosActuales - minutosInicio;
        porcentajeDiaPasado = (minutosTranscurridos / duracionDiaMinutos) * 100;
    }

    // Actualiza solo el valor de la barra de progreso del día
    if (barraProgresoDia) {
        barraProgresoDia.value = porcentajeDiaPasado;
    }
    
    // Actualizar el texto de la barra del día
    let textoDia = document.querySelector('.progress-text');
    if (textoDia) {
        textoDia.textContent = `${porcentajeDiaPasado.toFixed(1)}% del día (${horaInicioDia}-${horaFinDia})`;
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

