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

    // Crear contenedor para el tiempo configurado como etiqueta
    let tiempo_container = document.createElement('div')
    tiempo_container.classList.add('tiempo-configurado-container')
    tiempo_container.style.display = 'flex'
    tiempo_container.style.flexDirection = 'column'
    tiempo_container.style.alignItems = 'center'
    tiempo_container.style.gap = '2px'

    // Calcular el tiempo numérico para mostrar
    let tiempoNumerico = calcularTiempoNumerico(element)
    if (tiempoNumerico) {
        let tiempoTotalMinutos = calcularTiempoTotalMinutos(element)
        let colorEtiqueta = calcularColorPorTiempo(tiempoTotalMinutos)

        let tiempo_span = document.createElement('span')
        tiempo_span.classList.add('tiempo-configurado-etiqueta')
        tiempo_span.textContent = tiempoNumerico
        tiempo_container.appendChild(tiempo_span)
        
        // Aplicar estilos base comunes al elemento externo (tiempo_container)
        aplicarEstilosBaseEtiqueta(tiempo_container)
        
        // Aplicar colores específicos del tiempo con el mismo estilo que la racha
        // Usar el color del texto como base para fondo y borde
        tiempo_container.style.color = colorEtiqueta.background
        tiempo_container.style.backgroundColor = `${colorEtiqueta.background}20` // Transparencia del 20%
        tiempo_container.style.border = `1px solid ${colorEtiqueta.background}`

        // Debug: mostrar información en consola
        console.log(`Hábito: ${element.nombre}, Tiempo: ${tiempoTotalMinutos}min, Color: ${colorEtiqueta.background}`)
    }

    // Crear contenedor intermedio para racha
    let racha_container = document.createElement('div')
    racha_container.classList.add('racha-container')
    racha_container.style.display = 'flex'
    racha_container.style.flexDirection = 'column'
    racha_container.style.alignItems = 'center'
    racha_container.style.gap = '2px'
    
    // Crear contenedor para tags (siempre presente para consistencia)
    let tags_container = document.createElement('div')
    tags_container.classList.add('habito-tags-container')
    
    Nombre_habito.classList.add('titulo_habito')
    Nombre_habito_h1.classList.add('titulo_habito_texto')
    racha_habito_p.classList.add('racha_habito_texto')
    
    let texto_nombre = document.createTextNode(element.nombre)
    let texto_numero_racha = document.createTextNode( numero_racha_h)
    let span_racha = document.createElement("span");
    span_racha.appendChild(texto_numero_racha)
    racha_habito_p.appendChild(span_racha)
    
    // Aplicar estilos base comunes al elemento externo (racha_habito_p)
    aplicarEstilosBaseEtiqueta(racha_habito_p)
    
    // Aplicar estilos específicos de la racha al elemento externo
    racha_habito_p.style.webkitTextStroke = '.2px black'

    if (Number(numero_racha_h) == 0){
      // Amarillo para racha de 0 días
      racha_habito_p.style.color = "#f59e0b";  // Amarillo
      racha_habito_p.style.backgroundColor = "#fef3c7";  // Amarillo claro
      racha_habito_p.style.border = "1px solid #f59e0b";
    } else if (Number(numero_racha_h) < 0) {
      // Escala de amarillo a rojo puro para rachas negativas (0 días = amarillo, -30 días = rojo puro)
      const intensidad = Math.min(Math.abs(Number(numero_racha_h)) / 30, 1); // Máximo a 30 días negativos
      
      // Colores base: amarillo para 0 días, rojo puro para -30 días
      const amarilloBase = { r: 245, g: 158, b: 11 };    // #f59e0b - amarillo
      const rojoPuro = { r: 220, g: 38, b: 38 };         // #dc2626 - rojo puro
      
      // Interpolar colores
      const r = Math.round(amarilloBase.r + (rojoPuro.r - amarilloBase.r) * intensidad);
      const g = Math.round(amarilloBase.g + (rojoPuro.g - amarilloBase.g) * intensidad);
      const b = Math.round(amarilloBase.b + (rojoPuro.b - amarilloBase.b) * intensidad);

      racha_habito_p.style.color = `rgb(${r}, ${g}, ${b})`;
      racha_habito_p.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
      racha_habito_p.style.border = `1px solid rgba(${r}, ${g}, ${b}, 0.3)`;

    } else {
      // Para rachas positivas: verde (1 día) -> azul (100 días) -> dorado (100+ días)
      const diasRacha = Number(numero_racha_h);
      
      if (diasRacha >= 100) {
        // Dorado para rachas de 100+ días
        racha_habito_p.style.color = "#f59e0b";  // Dorado
        racha_habito_p.style.backgroundColor = "#fef3c7";  // Dorado claro
        racha_habito_p.style.border = "1px solid #f59e0b";
      } else {
        // Gradiente de verde a azul para rachas de 1-99 días
        const intensidad = Math.min((diasRacha - 1) / 99, 1); // De 1 día a 100 días
        
        // Colores base: verde para 1 día, azul para 100 días
        const verdeBase = { r: 34, g: 197, b: 94 };     // #22c55e - verde
        const azulBase = { r: 59, g: 130, b: 246 };    // #3b82f6 - azul
        
        // Interpolar colores
        const r = Math.round(verdeBase.r + (azulBase.r - verdeBase.r) * intensidad);
        const g = Math.round(verdeBase.g + (azulBase.g - verdeBase.g) * intensidad);
        const b = Math.round(verdeBase.b + (azulBase.b - verdeBase.b) * intensidad);

        racha_habito_p.style.color = `rgb(${r}, ${g}, ${b})`;
        racha_habito_p.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
        racha_habito_p.style.border = `1px solid rgba(${r}, ${g}, ${b}, 0.3)`;
      }
    }

    let boton_config = document.createElement("button")
    boton_config.style.backgroundColor = element.color
    boton_config.classList.add('boton_config')
    Nombre_habito_h1.appendChild(texto_nombre)
    Nombre_habito_h1.title = element.work_time
    
    // Estructura: nombre, racha centrada, tiempo configurado, y tags
    Nombre_habito.appendChild(Nombre_habito_h1)

    // Contenedor de racha pegado a la derecha
    racha_container.appendChild(racha_habito_p)

    // Agregar tiempo configurado debajo de la racha
    if (tiempoNumerico) {
        racha_container.appendChild(tiempo_container)
    }

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

// Función para calcular el tiempo numérico de un hábito (para mostrar en etiqueta)
function calcularTiempoNumerico(habito) {
    let tiempoNumerico = '';

    switch(habito.type__numero) {
        case 1: // Pomodoro
            if (habito.work_time && habito.count) {
                const tiempoTotal = (habito.work_time + habito.short_break) * habito.count - habito.short_break;
                const horas = Math.floor(tiempoTotal / 60);
                const minutos = tiempoTotal % 60;
                tiempoNumerico = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            }
            break;
        case 2: // Checker
            if (habito.work_time) {
                const horas = Math.floor(habito.work_time / 60);
                const minutos = habito.work_time % 60;
                tiempoNumerico = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            }
            break;
        case 3: // StopWatch
            // No mostrar tiempo para stopwatch ya que es manual
            break;
        default:
            break;
    }

    return tiempoNumerico;
}

// Función para calcular el tiempo total en minutos de un hábito
function calcularTiempoTotalMinutos(habito) {
    let tiempoTotal = 0;

    switch(habito.type__numero) {
        case 1: // Pomodoro
            if (habito.work_time && habito.count) {
                tiempoTotal = (habito.work_time + habito.short_break) * habito.count - habito.short_break;
            }
            break;
        case 2: // Checker
            if (habito.work_time) {
                tiempoTotal = habito.work_time;
            }
            break;
        case 3: // StopWatch
            tiempoTotal = 0; // No tiene tiempo predefinido
            break;
        default:
            tiempoTotal = 0;
    }

    return tiempoTotal;
}

// Función para aplicar estilos base comunes a las etiquetas
function aplicarEstilosBaseEtiqueta(elemento) {
    elemento.style.fontSize = '0.6em'           // Más pequeño
    elemento.style.fontWeight = 'bold'
    elemento.style.padding = '1px 4px'           // Más pequeño
    elemento.style.borderRadius = '6px'          // Más pequeño
    elemento.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)'
    elemento.style.display = 'inline-block'
    elemento.style.minWidth = '28px'             // Ancho mínimo para que quepa el texto
    elemento.style.maxWidth = '35px'             // Ancho máximo para mantener uniformidad
    elemento.style.textAlign = 'center'
    elemento.style.lineHeight = '1.1'            // Más compacto
    elemento.style.whiteSpace = 'nowrap'         // Evitar saltos de línea
    elemento.style.overflow = 'hidden'           // Ocultar texto que se salga
}

// Función para calcular el color de la etiqueta basado en el tiempo (azul para más tiempo, verde para ~1 minuto)
function calcularColorPorTiempo(minutos) {
    // Definir rangos de tiempo
    const tiempoMin = 1;   // 1 minuto - verde
    const tiempoMax = 60;  // 60 minutos - azul oscuro

    // Limitar el rango
    const tiempoLimitado = Math.max(tiempoMin, Math.min(tiempoMax, minutos));

    // Calcular el factor de interpolación (0 = verde, 1 = azul)
    const factor = (tiempoLimitado - tiempoMin) / (tiempoMax - tiempoMin);

    // Colores base: verde para tiempo corto, azul para tiempo largo
    const verdeTiempo = { r: 34, g: 197, b: 94 };     // #22c55e - verde para ~1 minuto
    const azulTiempo = { r: 59, g: 130, b: 246 };     // #3b82f6 - azul para más tiempo

    // Interpolar colores
    const r = Math.round(verdeTiempo.r + (azulTiempo.r - verdeTiempo.r) * factor);
    const g = Math.round(verdeTiempo.g + (azulTiempo.g - verdeTiempo.g) * factor);
    const b = Math.round(verdeTiempo.b + (azulTiempo.b - verdeTiempo.b) * factor);

    // Convertir a hex
    const backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    // Calcular color del borde (un poco más oscuro)
    const borderR = Math.max(0, r - 20);
    const borderG = Math.max(0, g - 20);
    const borderB = Math.max(0, b - 20);
    const borderColor = `#${borderR.toString(16).padStart(2, '0')}${borderG.toString(16).padStart(2, '0')}${borderB.toString(16).padStart(2, '0')}`;

    console.log(`Tiempo: ${minutos}min, Factor: ${factor.toFixed(2)}, Color: ${backgroundColor}`);

    return {
        background: backgroundColor,
        border: borderColor
    };
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

