function cargarDatosHabito(habito) {
    document.getElementById('id').value = habito.id;
    document.getElementById('nombre').value = habito.nombre;
    document.getElementById('work_time').value = habito.work_time;
    document.getElementById('short_break').value = habito.short_break;
    document.getElementById('count').value = habito.count;
    document.getElementById('type').value = habito.type__numero;
    document.getElementById('orden_n').value = habito.orden_n;
    document.getElementById('color_hab').value = habito.color;
    document.getElementById('objetivo').value = habito.objetivo;
    document.getElementById('archivado').value = habito.archivado;

    // Set selected days
    const diasSeleccionados = habito.dias_seleccionados.split(',');
    document.querySelectorAll('input[name="dias"]').forEach(checkbox => {
        checkbox.checked = diasSeleccionados.includes(checkbox.value);
    });

    // Set selected tags
    if (habito.tags && Array.isArray(habito.tags)) {
        const tagIds = habito.tags.map(tag => tag.id);
        document.getElementById('tags_seleccionados').value = JSON.stringify(tagIds);
        setSelectedTags(tagIds);
    } else {
        document.getElementById('tags_seleccionados').value = '[]';
        setSelectedTags([]);
    }
}

function fetch_lista_habitos(actualizar = false) {
    fetch('/habitos/getHabitosOnly')
        .then(response => response.json())
        .then(data => {
            if (data.habitos) {
                llenar_lista_habitos('miLista', false, false, data.habitos_por_hacer);
                llenar_lista_habitos('miLista_hechos', false, false, data.habitos_hechos);
                llenar_lista_habitos('miLista_archivados', false, false, data.habitos_archivados);
                
                if (actualizar) {
                    actualizarProgreso(data.habitos_por_hacer, data.habitos_hechos);
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

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