let elemento = document.querySelector(':root'); // Selecciona el elemento raíz
let estilo = getComputedStyle(elemento); // Obtiene los estilos computados del elemento
let colorPrimario = estilo.getPropertyValue('--mi-color-primario'); 
let colorSecundario = estilo.getPropertyValue('--mi-color-secundario'); 
let colorTerciario = estilo.getPropertyValue('--mi-color-terciario'); 
let colorCuaternario = estilo.getPropertyValue('--mi-color-cuaternario'); 

let data_historial
let records

let sortable
var sorteableActivado = false

// const path = require('path')
// Al cargar la página, recuperar el orden de la lista del archivo
function ordenar_lista_habitos () {
  let orden

  // Selecciona la lista
  const listaOrdenable = document.getElementById('miLista_ParaOrdenar')
  // Obtiene todos los elementos <li>
  const elementos = listaOrdenable.children
  // Ordena los elementos basados en su atributo id numérico
  const elementosOrdenados = Array.from(elementos).sort((a, b) => {
    const idA = parseInt(a.id)
    const idB = parseInt(b.id)
    return idA - idB
  })
  // Reemplaza los elementos en la lista con los elementos ordenados
  elementosOrdenados.forEach((elemento) => listaOrdenable.appendChild(elemento))

};

function eventos_lista_habitos () {
  url = '/habitos/get_listHabitos_Sort/'




  const lista = document.getElementById('miLista_ParaOrdenar')
  sortable = Sortable.create(lista, {
    handle: '.boton_drag',    // Solo se podrá arrastrar desde elementos con esta clase
    animation: 150,           // Velocidad de animación
    ghostClass: 'ghost',
    //sort: true,
    // Definir el evento onEnd
    onEnd: function (/** Event */evt) {

      fetch(url)
      .then(function(response){
    
        if(!response.ok){
          console.log('fallo')
          throw new Error('fallo')
        }
        return response.json()
    
      })
      .then(function(data){
        console.log(data.ListHabitosSort)
     
      const obj = data.ListHabitosSort

      // let nuevoOrden = sortable.toArray();
      const elementos_all = document.getElementById('miLista_ParaOrdenar')
      const elementos_li = elementos_all.children

      console.log(obj)
      console.log(elementos_li)

      const array = Array.from(elementos_li)
      console.log(array)

      // Ordenar el array
      array.sort(function (a, b) {
        const objA = JSON.parse(a.dataset.obj)
        const objB = JSON.parse(b.dataset.obj)

        // Comparar objA.orden_n y objB.orden_n
        return objA.orden_n - objB.orden_n
      })

      console.log(array)

      for (let i = 0; i < elementos_li.length; i++) {
        const id = obj[i].id

        const objStr = elementos_li[i].dataset.obj

        // Convertir la cadena de texto a un objeto
        const obj2 = JSON.parse(objStr)

        const index = obj.findIndex(item => item.id === obj2.id)
        obj[index].orden_n = Number(array[i].id)
      }

     // actualizar_listas()
     console.log(obj)

      console.log('se guardo orden json')
    })
    }
  })

  ordenar_lista_habitos()
}



// importante ocultado mientras
// window.onload = eventos_lista_habitos

// window.onload =  ordenar_lista_habitos

// function leer_archivo_historial (archivo) {
//   const data = fs.readFileSync(archivo, 'utf8')
//   const records = Papa.parse(data, {
//     header: true,
//     skipEmptyLines: true
//   }).data

//   // console.log(records)
//   return records
// }



function ActivarOrdenarLista(){
  sorteableActivado = !sorteableActivado
  ventanalistas = document.getElementById('ventana1')
  ventanaOrdenar = document.getElementById('ventana3')
  
  if (sorteableActivado){
    ventanalistas.style.display = 'none'
    ventanaOrdenar.style.display = 'block'
    fetch_OrdenarListaHabitos()
    .then(function(data) {
      llenar_lista_habitosAOrdenar( 'miLista_ParaOrdenar', data.ListHabitosSort)
      .then( () => {

        eventos_lista_habitos()
      }
        )
      })
      sortable.option('sort', sorteableActivado);
      // document.getElementById('des_archivar_borrar').style.display = 'block'
      // document.getElementById('archivar_borrar').style.display = 'none'
    }else{
      ventanalistas.style.display = 'block'
      ventanaOrdenar.style.display = 'none'
      sortable.option('sort', sorteableActivado);
      sortable.destroy();
      const elementos_all = document.getElementById('miLista_ParaOrdenar')
      elementos_all.innerHTML = ''
      // document.getElementById('des_archivar_borrar').style.display = 'none'
      // document.getElementById('archivar_borrar').style.display = 'block'
    }

}

function fetch_OrdenarListaHabitos(){

  url = '/habitos/get_listHabitos_Sort/';
  return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('La solicitud falló');
            }
            return response.json();
        })
}


function registrar_Habitos_checker(habito_obj) {
  console.log(habito_obj)
  id_habito = habito_obj.id + ''

  var url = `/habitos/setHistory/${habito_obj.id}`

  fetch(url)
  .then(function(response){

    if (!response.ok) {
      throw new Error('fallo')
    }

    return response.json()

  })
  .then(function(data){

    console.log(data)
    actualizar_listas()

  })
}

function cambiarVentana (id) {
  const ventanas = document.getElementsByClassName('ventana')
  for (let i = 0; i < ventanas.length; i++) {
    ventanas[i].style.display = 'none'
  }
  document.getElementById(id).style.display = 'block'
}

function configurar_habito (valor) {
  const titulo = document.getElementById('titulo_habito')
  titulo.innerText = valor.nombre

  document.getElementById('id').value = valor.id
  document.getElementById('nombre').value = valor.nombre
  document.getElementById('work_time').value = valor.work_time
  document.getElementById('short_break').value = valor.short_break
  document.getElementById('count').value = valor.count
  document.getElementById('type').value = valor.type__numero
  document.getElementById('orden_n').value = valor.orden_n
  document.getElementById('color_hab').value = valor.color
  document.getElementById('archivado').value = valor.archivado
  document.getElementById('objetivo').value = valor.objetivo

  // Configurar los días seleccionados
  const diasSeleccionados = (valor.dias_seleccionados || '1,2,3,4,5,6,7').split(',')
  const checkboxes = document.querySelectorAll('input[name="dias"]')
  checkboxes.forEach(checkbox => {
    checkbox.checked = diasSeleccionados.includes(checkbox.value)
  })

  resetBorderColorsHabit(valor.color)

  console.log(valor.orden_n)

  const button = document.getElementById('boton_agregar')
  button.onclick = function () {
    guardar_habito_json()
  }

  document.getElementById('boton_borrar').style.display = 'block'
  if (valor.archivado){
    document.getElementById('des_archivar_borrar').style.display = 'block'
    document.getElementById('archivar_borrar').style.display = 'none'
  }else{
    document.getElementById('des_archivar_borrar').style.display = 'none'
    document.getElementById('archivar_borrar').style.display = 'block'
  }
}

function guardar_habito_json () {
  const id = document.getElementById('id').value
  const nombre = document.getElementById('nombre').value
  const work_time = document.getElementById('work_time').value
  const short_break = document.getElementById('short_break').value
  const count = document.getElementById('count').value
  const type = document.getElementById('type').value
  const orden_n = document.getElementById('orden_n').value
  const color_hab = document.getElementById('color_hab').value
  const archivado = document.getElementById('archivado').value
  const objetivo = document.getElementById('objetivo').value

  // Obtener los días seleccionados
  const diasSeleccionados = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
    .map(checkbox => checkbox.value)
    .join(',')

  const data = {
    id: id,
    nombre: nombre,
    work_time: work_time,
    short_break: short_break,
    count: count,
    type: type,
    orden_n: orden_n,
    color_hab: color_hab,
    archivado: archivado,
    objetivo: objetivo,
    dias_seleccionados: diasSeleccionados
  }

  fetch('/habitos/guardar_habito/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      actualizar_listas(true)
      cambiarVentana('ventana1')
    } else {
      alert('Error al guardar el hábito')
    }
  })
  .catch(error => {
    console.error('Error:', error)
    alert('Error al guardar el hábito')
  })
}

function actualizar_listas (principal) {
  // document.getElementById('miLista').innerHTML = ''
  // let lista = document.getElementById('miLista')
  // while(lista.firstChild){
  //   lista.removeChild(lista.firstChild)
  // }

  document.getElementById('miLista_hechos').innerHTML = ''
  document.getElementById('miLista_archivados').innerHTML = ''

  if (principal){
    console.log('se hara fetch', principal)
    fetch_lista_habitos(principal)
  }else{
    fetch_lista_habitos()
  }

  // llenar_lista_habitos('miLista_hechos', true, false)
  // llenar_lista_habitos('miLista_archivados', false, true)
  // llenar_lista_habitos('miLista_archivados', true, true)
  // llenar_lista_habitos('miLista', false, false)
  console.log('guardar')
  eventos_lista_habitos()
}



function configurar_habito_nuevo () {
  cambiarVentana('ventana2')
  const titulo = document.getElementById('titulo_habito')
  titulo.innerText = ''

  document.getElementById('id').value = ''
  document.getElementById('nombre').value = ''
  document.getElementById('work_time').value = ''
  document.getElementById('short_break').value = ''
  document.getElementById('count').value = ''
  document.getElementById('type').value = ''
  document.getElementById('orden_n').value = ''
  document.getElementById('color_hab').value = ''
  document.getElementById('archivado').value = ''
  document.getElementById('objetivo').value = ''

  resetBorderColorsHabit('none')

  // console.log(valor.orden_n)

  const button = document.getElementById('boton_agregar')
  button.onclick = function () {
    agregar_Nuevo_habito_js()
  }

  document.getElementById('boton_borrar').style.display = 'none'
  document.getElementById('archivar_borrar').style.display = 'none'
  document.getElementById('des_archivar_borrar').style.display = 'none'
}



function calcular_habitos_restanten (hecho, cantidad) {
  if (!hecho) {
    cantidad = cantidad + 1
  }

  return cantidad
}
function calcular_tiempo_restante(hecho, total, tiempo, ciclos) {
  tiempoTotal = Number(ciclos) * Number(tiempo) 
  console.log(total + '-'+tiempo)
  if (!hecho) {
    total = total + tiempoTotal
  }

  return total
}

function calcularDiasDeRachaHastaHoy (id, datos, hecho) {
  // Filtrar los datos por id
  const datosFiltrados = datos.filter(d => d.id_habito == id)
  
  // Obtener los días seleccionados para este hábito
  const habito = datos.find(d => d.id_habito == id)
  const diasSeleccionados = (habito.dias_seleccionados || '1,2,3,4,5,6,7').split(',').map(Number)

  // Ordenar los datos por fecha
  datosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  // Calcular los días de racha
  let racha = 0
  let hoy = new Date()
  hoy.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

  if (!hecho) {
    hoy.setDate(hoy.getDate() - 1)
  }

  // Función para verificar si un día es un día seleccionado
  function esDiaSeleccionado(fecha) {
    const diaSemana = fecha.getDay() || 7 // Convertir 0 (Domingo) a 7
    return diasSeleccionados.includes(diaSemana)
  }

  // Función para encontrar el siguiente día seleccionado
  function siguienteDiaSeleccionado(fecha) {
    let fechaActual = new Date(fecha)
    fechaActual.setDate(fechaActual.getDate() - 1)
    
    while (!esDiaSeleccionado(fechaActual)) {
      fechaActual.setDate(fechaActual.getDate() - 1)
    }
    return fechaActual
  }

  // Función para verificar si dos fechas son consecutivas considerando solo días seleccionados
  function sonDiasConsecutivos(fecha1, fecha2) {
    let fechaTemp = new Date(fecha1)
    fechaTemp.setDate(fechaTemp.getDate() + 1)
    
    while (!esDiaSeleccionado(fechaTemp)) {
      fechaTemp.setDate(fechaTemp.getDate() + 1)
    }
    
    return fechaTemp.getTime() === fecha2.getTime()
  }

  // Comenzar desde el último día registrado
  for (let i = datosFiltrados.length - 1; i >= 0; i--) {
    const fechaActual = new Date(datosFiltrados[i].fecha)
    fechaActual.setHours(0, 0, 0, 0)

    // Verificar si la fecha actual es un día seleccionado
    if (!esDiaSeleccionado(fechaActual)) {
      continue // Saltar días no seleccionados
    }

    if (racha === 0) {
      // Si es el primer día de la racha
      if (fechaActual.getTime() === hoy.getTime() || 
          sonDiasConsecutivos(fechaActual, hoy)) {
        racha = 1
      }
    } else {
      // Verificar si el día actual es consecutivo al día anterior
      const fechaAnterior = new Date(datosFiltrados[i + 1].fecha)
      fechaAnterior.setHours(0, 0, 0, 0)
      
      if (sonDiasConsecutivos(fechaActual, fechaAnterior)) {
        racha++
      } else {
        break // La racha se rompe
      }
    }
  }

  return racha
}

// Función para verificar si dos fechas son consecutivas
function esFechaConsecutiva (fecha1, fecha2) {
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000
  return Math.abs(fecha1 - fecha2) === unDiaEnMilisegundos
}

// Función para restar un día a una fecha
function restarUnDia (fecha) {
  return new Date(fecha.getTime() - 24 * 60 * 60 * 1000)
}

function resetBorderColorsHabit(colorHabito) {
  let colorPalette = document.getElementById('colorPalette');
  var divsHijos = colorPalette.getElementsByTagName('div');

  for (var i = 0; i < divsHijos.length; i++) {
    if (divsHijos[i].style.backgroundColor == colorHabito ){
      
      divsHijos[i].style.border = '3px solid black';
    }else{
      divsHijos[i].style.border = "none";

    }
  }
}

function convertirMinutosAHoras(minutos) {
  var horas = Math.floor(minutos / 60);
  var minutosRestantes = minutos % 60;
  return horas + " horas y " + minutosRestantes + " minutos";
}



function obtener_historial_habitos(diario){
  const data = fs.readFileSync('historial_habitos.csv', 'utf8');
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data;

  if (diario){
    const hoy = new Date().toLocaleDateString('en-CA')
  
    const filteredData = records.filter(record => record.fecha === hoy);
    console.log(typeof(filteredData))
    return filteredData
    
  }else{
    console.log(typeof(records))
    return records
    
  }


}



function Ver_horas_invertidas_habito(tiempo){


  let label_horas_habito = document.getElementById('horas_invertidas_habito')
  label_horas_habito.innerText = ''
  
  // const data = fs.readFileSync('historial_habitos.csv', 'utf8');
  // const records = Papa.parse(data, {
  //   header: true,
  //   skipEmptyLines: true
  // }).data;

  // const hoy = new Date().toLocaleDateString('en-CA')
  
  // const filteredData = records.filter(record => record.id_habito === id);
  // console.log('-----------')
  // console.log(filteredData)
  // console.log(hoy)
  
  // for (let dia in filteredData){
  //   console.log('--eeeeeeeeemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm-----')
  //   console.log(dia)
  // }
  
  // let totalSegundos = 0;
  
  // filteredData.forEach(objeto => {
  //   console.log(objeto.duracion)
    
  //   let tiempo = objeto.duracion.split(':'); // divide la duración en horas, minutos y segundos
  //   let segundos = (+tiempo[0]) * 60 * 60 + (+tiempo[1]) * 60 + (+tiempo[2]); 
  //   totalSegundos += segundos;
  // } )
  
  let horas = tiempo['Horas']
  let minutos = tiempo['Minutos']
  let segundos = tiempo['Segundos']
  
  console.log(`Duración total: ${horas}:${minutos}:${segundos}`);

  // Asegurarse de que las horas, minutos y segundos siempre tengan dos dígitos
horas = horas < 10 ? '0' + horas : horas;
minutos = minutos < 10 ? '0' + minutos : minutos;
segundos = segundos < 10 ? '0' + segundos : segundos;

console.log(`Duración total: ${horas} horas, ${minutos} minutos y ${segundos} segundos`);
label_horas_habito.innerHTML = `Total de tiempo: <strong class="horas_css">${horas}</strong> horas: <strong class="minutos_css">${minutos}</strong> min: <strong class="seg_css">${segundos}</strong> seg`
}

function dias_totales_invertidos_habito(Ndias){
  let label_horas_habito = document.getElementById('dias_totales_invertidas_habito')
  label_horas_habito.innerText = ''
  label_horas_habito.innerHTML = `Total de días: <strong class="minutos_css">${Ndias}</strong>`
}


function obtenerObjetoHabito(id) {
  const data = fs.readFileSync('data.json', 'utf8')
  let jsonData = JSON.parse(data)
  jsonData = jsonData.filter(item => item.id == Number(id))

  return jsonData[0]

}

document.querySelector('.dropbtn').addEventListener('click', function() {
  //document.getElementById('myDropdown').classList.toggle('show');

  var dropdowns = document.getElementById("myDropdown");
  var i;
 
    var openDropdown = dropdowns;
    if (openDropdown.classList.contains('show')) {
      console.log('show')
      openDropdown.classList.remove('show');
    }else{
      openDropdown.classList.add('show');
    }
  
  console.log('click')
});
