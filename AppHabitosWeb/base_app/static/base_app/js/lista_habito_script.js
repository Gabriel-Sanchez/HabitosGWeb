fetch_lista_habitos(true)

function llenar_lista_habitos(nombre_lista, hecho, IsHabitoArchivado, data) {
  let lista_final = document.getElementById(nombre_lista);
  let lista = document.createDocumentFragment();

  // Limpiar la lista existente antes de agregar nuevos elementos
  lista_final.innerHTML = '';
  
  // Los datos ya vienen ordenados de fetch_lista_habitos
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    let li = document.createElement("li");
    li.classList.add('elemento_lista')
    li.id = element.orden_n
    
    let objStr = JSON.stringify(element);
    li.dataset.obj = objStr;
    numero_racha_h = element.racha

    let div_item_h = document.createElement('div')
    let div_botones = document.createElement('div')
    div_botones.classList.add('div_botones')
    li.appendChild(div_item_h)
    lista.appendChild(li);
    
    let Nombre_habito = document.createElement('div')
    let Nombre_habito_h1 = document.createElement('h1')
    let racha_habito_p = document.createElement('h6')
    
    // Crear contenedor intermedio para racha
    let racha_container = document.createElement('div')
    racha_container.classList.add('racha-container')
    
    // Crear contenedor para tags (siempre presente para consistencia)
    let tags_container = document.createElement('div')
    tags_container.classList.add('habito-tags-container')
    
    Nombre_habito.classList.add('titulo_habito')
    Nombre_habito_h1.classList.add('titulo_habito_texto')
    racha_habito_p.classList.add('racha_habito_texto')
    
    let texto_nombre = document.createTextNode(element.nombre)
    let texto_numero_racha = document.createTextNode( numero_racha_h)
    let span_racha = document.createElement("span");
    span_racha.style.webkitTextStroke = '.2px black'

    if (Number(numero_racha_h) == 0){
      span_racha.style.color = "orange";
    } else if (Number(numero_racha_h) <0
    ) {
      span_racha.style.color = "red";
      
    } else {
      span_racha.style.color = "green";
      
    }
    span_racha.appendChild(texto_numero_racha)
    racha_habito_p.appendChild(span_racha)

    let boton_config = document.createElement("button")
    boton_config.style.backgroundColor = element.color
    boton_config.classList.add('boton_config')
    Nombre_habito_h1.appendChild(texto_nombre)
    Nombre_habito_h1.title = element.work_time
    
    // Estructura: nombre, racha centrada, y tags
    Nombre_habito.appendChild(Nombre_habito_h1)
    
    // Contenedor de racha pegado a la derecha
    racha_container.appendChild(racha_habito_p)
    Nombre_habito.appendChild(racha_container)
    
    // Agregar tags si existen, si no, mantener espacio para consistencia
    if (element.tags && element.tags.length > 0) {
      element.tags.forEach(tag => {
        let tag_badge = document.createElement('span')
        tag_badge.classList.add('habito-tag-badge')
        tag_badge.textContent = tag.nombre
        tag_badge.style.backgroundColor = tag.color
        // Determinar color del texto basado en el color de fondo
        const brightness = getBrightness(tag.color)
        tag_badge.style.color = brightness > 128 ? '#000' : '#fff'
        tags_container.appendChild(tag_badge)
      })
    }
    // Siempre agregar el contenedor de tags para mantener consistencia visual
    Nombre_habito.appendChild(tags_container)
    
    div_item_h.appendChild(boton_config);
    div_item_h.appendChild(Nombre_habito);
    let botn = document.createElement("button")
    let botn_graf = document.createElement("button")

    document.body.append(botn);
    div_item_h.appendChild(div_botones)

    botn_graf.innerHTML = '<i class="material-icons">calendar_today</i>';
    document.body.append(botn_graf);

    // Asignar un valor al botón
    botn.value = element;
    botn_graf.value = element;
    div_botones.appendChild(botn)
    div_botones.appendChild(botn_graf)

    div_color = document.createElement('div')
    div_color.classList.add('div_color_habito')
    div_color.style.backgroundColor = element.color
    div_botones.appendChild(div_color)

    let objeto = element

    botn.classList.add('boton_habito')
    botn_graf.classList.add('boton_habito')
    
    Nombre_habito.addEventListener('click', function () {
      configurar_habito(objeto)
      cambiarVentana('ventana2')
    })
    
    div_item_h.classList.add('carta_lista')
    
    if (element.type__numero == 1) {
      div_item_h.classList.add('item_habito')
      botn.classList.add('boton_pomodono')
      botn.innerHTML = '<i class="material-icons">alarm</i>';
      
      botn.addEventListener('click', function () {
        
        window.location.href = `/pomodoro/pomo_ven/${objeto.id}`;
        
        
        console.log('a')
        // mientras
        // ipcRenderer.send('abrir-ventana-secundaria', objeto)
      })
    } else if (element.type__numero == 2) {
      div_item_h.classList.add('item_habito_check')
      botn.classList.add('boton_checker')
      botn.innerHTML = '';
      botn.innerHTML = '<i class="material-icons">check</i>';
      botn.addEventListener('click', function () {
        console.log('Antes de agregar la clase oculto v3');
        console.log(li);
        li.classList.add('oculto') // Agrega la clase inmediatamente
        console.log('Después de agregar la clase oculto');
        requestAnimationFrame(() => {
          registrar_Habitos_checker(objeto); // Llama al método después de renderizar
          definir(objeto);
        });
      })

    } else if (element.type__numero == 3) {
      div_item_h.classList.add('item_habito_timer')
      botn.classList.add('boton_pomodono')
      botn.innerHTML = '<i class="material-icons">timer</i>';
      
      botn.addEventListener('click', function () {
        
        window.location.href = `/pomodoro/stopWatch/${objeto.id}`;
        
        
        console.log('a')
        // mientras
        // ipcRenderer.send('abrir-ventana-secundaria', objeto)
      })
    }

    botn_graf.addEventListener('click', function () {
      graficos_display()
      definir(objeto)
      generarGraficoDuracionPorAnio(objeto.id+'', objeto.objetivo);
      graficar_semana(objeto.id+'', objeto.objetivo);
      // mientras
      
      //mostrar_flechas()
    })

  }

  lista_final.appendChild(lista)
}

function graficos_display(){
  document.getElementById('columna2-id').style.display  = "block";
  console.log('columna2  flex')
}


function fetch_lista_habitos(principal){
    let url = '/habitos/getHabitosR/';
    fetch(url)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('La solicitud falló');
        }
        return response.json();
    })
    .then(function(data) {
        // Validar y normalizar los datos antes de mostrarlos
        const normalizarDatos = (lista) => {
            return lista.map(item => ({
                ...item,
                orden_n: typeof item.orden_n === 'number' ? item.orden_n : 0
            })).sort((a, b) => {
                const ordenA = parseInt(a.orden_n);
                const ordenB = parseInt(b.orden_n);
                return ordenA - ordenB;
            });
        };

        // Normalizar y ordenar los datos para cada lista
        if (principal) {
            const habitosPorHacer = normalizarDatos(data.Habitos_por_hacer);
            llenar_lista_habitos('miLista', false, false, habitosPorHacer);
        }
        
        const habitosHechos = normalizarDatos(data.Habitos_hechos);
        const habitosArchivados = normalizarDatos(data.ListaHArchivados);
        
        llenar_lista_habitos('miLista_hechos', false, false, habitosHechos);
        llenar_lista_habitos('miLista_archivados', false, true, habitosArchivados);

        set_tiempo_restante_Hoy(data.Tiempo_Restante_Hoy);
        set_numero_restante_Hoy(data.Numero_Restante_Hoy);
        actualizar_horas_realizadas(data.Tiempo_completado_Hoy);
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}   

function actualizar_listas(principal){
    let url = '/habitos/getHabitosR/';
    fetch(url)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('La solicitud falló');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Datos recibidos:', data);
        
        // Validar y normalizar los datos antes de mostrarlos
        const normalizarDatos = (lista) => {
            if (!Array.isArray(lista)) {
                console.warn('Lista no es un array:', lista);
                return [];
            }
            return lista.map(item => ({
                ...item,
                orden_n: typeof item.orden_n === 'number' ? item.orden_n : 0
            })).sort((a, b) => {
                const ordenA = parseInt(a.orden_n);
                const ordenB = parseInt(b.orden_n);
                return ordenA - ordenB;
            });
        };

        // Normalizar y ordenar los datos para cada lista
        if (principal) {
            const habitosPorHacer = normalizarDatos(data.Habitos_por_hacer);
            llenar_lista_habitos('miLista', false, false, habitosPorHacer);
        }
        
        const habitosHechos = normalizarDatos(data.Habitos_hechos);
        const habitosArchivados = normalizarDatos(data.ListaHArchivados);
        
        llenar_lista_habitos('miLista_hechos', false, false, habitosHechos);
        llenar_lista_habitos('miLista_archivados', false, true, habitosArchivados);

        // Actualizar estadísticas solo si están disponibles
        if (data.Tiempo_Restante_Hoy) {
            set_tiempo_restante_Hoy(data.Tiempo_Restante_Hoy);
        }
        if (data.Numero_Restante_Hoy !== undefined) {
            set_numero_restante_Hoy(data.Numero_Restante_Hoy);
        }
        if (data.Tiempo_completado_Hoy) {
            actualizar_horas_realizadas(data.Tiempo_completado_Hoy);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}

// Variables globales para almacenar la configuración del usuario
let userConfigStartOfDay = null;
let userConfigEndOfDay = null;

// Función para obtener la configuración del usuario
async function obtenerConfiguracionUsuarioTiempo() {
    try {
        const response = await fetch('/users/api/user-config/');
        const data = await response.json();
        if (data.status === 'success') {
            userConfigStartOfDay = data.inicio_dia;
            userConfigEndOfDay = data.fin_dia;
        } else {
            userConfigStartOfDay = '00:00'; // valor por defecto
            userConfigEndOfDay = '23:59'; // valor por defecto
        }
    } catch (error) {
        console.error('Error al obtener configuración del usuario:', error);
        userConfigStartOfDay = '00:00'; // valor por defecto
        userConfigEndOfDay = '23:59'; // valor por defecto
    }
}

// Función para actualizar la barra de progreso con información básica del día
function actualizarBarraProgresoBásica() {
    let tiempoRestante = document.getElementById('tiempo_restante');
    
    let ahora = new Date();
    let minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    
    // Usar el horario configurado del usuario
    let horaInicioDia = userConfigStartOfDay ? userConfigStartOfDay : '00:00';
    let horaFinDia = userConfigEndOfDay ? userConfigEndOfDay : '23:59';
    
    let [horaInicio, minutoInicio] = horaInicioDia.split(':').map(Number);
    let [horaFin, minutoFin] = horaFinDia.split(':').map(Number);
    
    let minutosInicio = horaInicio * 60 + minutoInicio;
    let minutosFin = horaFin * 60 + minutoFin;
    
    // Verificar si estamos dentro del horario del día
    if (minutosActuales < minutosInicio) {
        // Antes del inicio del día
        let minutosHastaInicio = minutosInicio - minutosActuales;
        let horasHastaInicio = Math.floor(minutosHastaInicio / 60);
        let minutosRestantesHastaInicio = minutosHastaInicio % 60;
        
        if (tiempoRestante) {
            tiempoRestante.innerHTML = `El día inicia en ${horasHastaInicio}h ${minutosRestantesHastaInicio}m (${horaInicioDia})`;
        }
        return;
    }
    
    if (minutosActuales > minutosFin) {
        // Después del fin del día
        if (tiempoRestante) {
            tiempoRestante.innerHTML = `El día ha terminado (horario: ${horaInicioDia} - ${horaFinDia})`;
        }
        return;
    }
    
    // Dentro del horario del día - calcular tiempo restante
    let minutosRestantesDelDia = minutosFin - minutosActuales;
    let horasRestantesDelDia = Math.floor(minutosRestantesDelDia / 60);
    let minutosRestantes = minutosRestantesDelDia % 60;
    
    // Información detallada arriba
    if (tiempoRestante) {
        tiempoRestante.innerHTML = `Quedan ${horasRestantesDelDia}h ${minutosRestantes}m del día (hasta ${horaFinDia})`;
    }
}

// Inicializar la configuración del usuario al cargar la página
obtenerConfiguracionUsuarioTiempo().then(() => {
    actualizarBarraProgresoBásica();
});

function set_tiempo_restante_Hoy(tiempoRestante){
  let elemento_tiempo_restante = document.getElementById('tiempo_restante');
  
  // Verificar que los datos sean válidos
  if (!tiempoRestante || typeof tiempoRestante.Horas === 'undefined' || typeof tiempoRestante.Minutos === 'undefined') {
    // Si no hay datos válidos, mostrar información básica del día
    actualizarBarraProgresoBásica();
    return;
  }
  
  // Calcular las horas restantes del día usando el horario configurado del usuario
  let ahora = new Date();
  let minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
  
  // Usar el horario configurado del usuario
  let horaInicioDia = userConfigStartOfDay ? userConfigStartOfDay : '00:00';
  let horaFinDia = userConfigEndOfDay ? userConfigEndOfDay : '23:59';
  
  let [horaInicio, minutoInicio] = horaInicioDia.split(':').map(Number);
  let [horaFin, minutoFin] = horaFinDia.split(':').map(Number);
  
  let minutosInicio = horaInicio * 60 + minutoInicio;
  let minutosFin = horaFin * 60 + minutoFin;
  
  let horasRestantesDelDia = 0;
  let minutosRestantesDelDia = 0;
  
  // Calcular tiempo restante solo si estamos dentro del horario del día
  if (minutosActuales >= minutosInicio && minutosActuales <= minutosFin) {
    let minutosRestantes = minutosFin - minutosActuales;
    horasRestantesDelDia = Math.floor(minutosRestantes / 60);
    minutosRestantesDelDia = minutosRestantes % 60;
  }
  
  // Asegurar que sean números válidos
  let horas = parseInt(tiempoRestante.Horas) || 0;
  let minutos = parseInt(tiempoRestante.Minutos) || 0;
  
  // Convertir tiempo restante de hábitos a minutos totales
  let tiempoHabitosEnMinutos = (horas * 60) + minutos;
  let horasRestantesDelDiaEnMinutos = (horasRestantesDelDia * 60) + minutosRestantesDelDia;
  
  let textoHabitos = `${horas}h ${minutos}m`;
  let textoTiempoRestante = `${horasRestantesDelDia}h ${minutosRestantesDelDia}m`;
  
  // Obtener horario para mostrar en la información
  let horaInicioConfig = userConfigStartOfDay ? userConfigStartOfDay : '00:00';
  let horaFinConfig = userConfigEndOfDay ? userConfigEndOfDay : '23:59';
  
  // Información detallada arriba
  if (elemento_tiempo_restante) {
    // Verificar si estamos fuera del horario del día
    if (horasRestantesDelDia === 0 && minutosRestantesDelDia === 0) {
      elemento_tiempo_restante.innerHTML = `
        <div style="font-weight: bold;">${textoHabitos} pendientes</div>
        <div style="font-size: 0.9em; color: #666;">Fuera del horario (${horaInicioConfig} - ${horaFinConfig})</div>
      `;
    }
    else if (tiempoHabitosEnMinutos > horasRestantesDelDiaEnMinutos && horasRestantesDelDiaEnMinutos > 0) {
      // Hay más trabajo que tiempo disponible
      let excesoEnMinutos = tiempoHabitosEnMinutos - horasRestantesDelDiaEnMinutos;
      let excesoHoras = Math.floor(excesoEnMinutos / 60);
      let excesoMinutos = excesoEnMinutos % 60;
      
      let textoExceso = excesoHoras > 0 ? 
        `${excesoHoras}h ${excesoMinutos}m de exceso` : 
        `${excesoMinutos}m de exceso`;
      
              elemento_tiempo_restante.innerHTML = `
          <div style="color: #d32f2f; font-weight: bold;">${textoHabitos} pendientes</div>
          <div style="font-size: 0.9em;">Quedan ${textoTiempoRestante} (hasta ${horaFinConfig}) - ${textoExceso}</div>
        `;
    } else {
      // Tiempo normal
              elemento_tiempo_restante.innerHTML = `
          <div style="font-weight: bold;">${textoHabitos} pendientes</div>
          <div style="font-size: 0.9em;">Quedan ${textoTiempoRestante} del día (hasta ${horaFinConfig})</div>
        `;
    }
  }
  
  // Guardar el tiempo restante para el cálculo del progreso
  ultimoTiempoRestante = tiempoRestante;
  
  // Actualizar la barra de progreso de las tareas si tenemos ambos datos
  if (ultimasHorasCompletadas && ultimoTiempoRestante && typeof actualizarProgresoTareas === 'function') {
    actualizarProgresoTareas(ultimasHorasCompletadas, ultimoTiempoRestante);
  }
}
function set_numero_restante_Hoy(tiempoRestante){
  let texto_numeros_restantes = document.getElementById('tareas_restantes')
  texto_numeros_restantes.innerText = tiempoRestante
}

// Variables globales para almacenar los datos para el cálculo de progreso
let ultimasHorasCompletadas = null;
let ultimoTiempoRestante = null;

function actualizar_horas_realizadas(horasCompletadas){

    label_horas_completadas = document.getElementById('horas_completadas')
    horas_completadas.innerText = ''
    
    let horas = horasCompletadas.Horas
    let minutos = horasCompletadas.Minutos
    let segundos = horasCompletadas.Segundos
    
    console.log(`Duración total: ${horas}:${minutos}:${segundos}`);

    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;

    console.log(`Duración total: ${horas} horas, ${minutos} minutos y ${segundos} segundos`);
    horas_completadas.innerText = `${horas}:${minutos}:${segundos}`
    
    // Guardar las horas completadas para el cálculo del progreso
    ultimasHorasCompletadas = horasCompletadas;
    
    // Actualizar la barra de progreso de las tareas si tenemos ambos datos
    if (ultimasHorasCompletadas && ultimoTiempoRestante && typeof actualizarProgresoTareas === 'function') {
        actualizarProgresoTareas(ultimasHorasCompletadas, ultimoTiempoRestante);
    }
}


function llenar_lista_habitosAOrdenar(nombre_lista, data) {

  return new Promise((resolve, reject) => {
  
  let lista = document.getElementById(nombre_lista);
  
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    let li = document.createElement("li");
    li.classList.add('elemento_lista')
    li.id = data[index].orden_n
    
    let objStr = JSON.stringify(data[index]);
    
    // Agregar la cadena de texto al atributo data-obj del elemento
    li.dataset.obj = objStr;
    numero_racha_h = data[index].racha

    let div_item_h = document.createElement('div')
    let div_botones = document.createElement('div')
    div_botones.classList.add('div_botones')
    li.appendChild(div_item_h)
    lista.appendChild(li);
    let Nombre_habito = document.createElement('div')
    let Nombre_habito_h1 = document.createElement('h1')
    let racha_habito_p = document.createElement('h6')
    Nombre_habito.classList.add('titulo_habito')
    Nombre_habito_h1.classList.add('titulo_habito_texto')
    racha_habito_p.classList.add('racha_habito_texto')
    let texto_nombre = document.createTextNode(data[index].nombre)

    let boton_config = document.createElement("button")
    boton_config.style.backgroundColor = data[index].color
    boton_config.classList.add('boton_config')
    
    // Agregar botón de editar
    let boton_editar = document.createElement("button")
    boton_editar.classList.add('boton_editar')
    boton_editar.innerHTML = '<i class="material-icons">edit</i>'
    boton_editar.title = 'Editar hábito'
    
    Nombre_habito_h1.appendChild(texto_nombre)
    Nombre_habito_h1.title = data[index].work_time
    Nombre_habito.appendChild(Nombre_habito_h1)
    Nombre_habito.appendChild(racha_habito_p)
    div_item_h.appendChild(boton_config)
    div_item_h.appendChild(boton_editar) // Agregar botón de editar
    div_item_h.appendChild(Nombre_habito)
    
    let botn = document.createElement("button")
    let botn_graf = document.createElement("button")
    document.body.append(botn)
    div_item_h.appendChild(div_botones)

    botn_graf.classList.add("boton_drag")
    botn_graf.innerHTML = '<i class="material-icons">drag_indicator</i>'

    botn.value = data[index]
    botn_graf.value = data[index]
    div_botones.appendChild(botn)
    div_botones.appendChild(botn_graf)

    div_color = document.createElement('div')
    div_color.classList.add('div_color_habito')
    div_color.style.backgroundColor = data[index].color
    div_botones.appendChild(div_color)

    let objeto = data[index]

    botn_graf.classList.add('boton_habito')
    
    boton_config.addEventListener('click', function () {
      configurar_habito(objeto)
      cambiarVentana('ventana2')
    })
    
    // Agregar evento al botón de editar
    boton_editar.addEventListener('click', function () {
      configurar_habito(objeto)
      cambiarVentana('ventana2')
    })
    
    div_item_h.classList.add('carta_lista')
    
    if (data[index].type__numero == 1) {
      div_item_h.classList.add('item_habito')
    } else {
      div_item_h.classList.add('item_habito_check')
    }
  }
  resolve()
  })
}

// Función auxiliar para calcular el brillo de un color
function getBrightness(hexColor) {
  // Asegurar que el color tenga el formato correcto
  if (!hexColor || hexColor.length < 6) {
    return 128; // Valor por defecto
  }
  
  // Añadir # si no lo tiene
  if (!hexColor.startsWith('#')) {
    hexColor = '#' + hexColor;
  }
  
  // Convertir hex a RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Validar que los valores sean números válidos
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return 128; // Valor por defecto
  }
  
  // Calcular brillo usando la fórmula de luminancia
  return (r * 299 + g * 587 + b * 114) / 1000;
}

