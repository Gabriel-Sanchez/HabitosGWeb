

let elemento = document.querySelector(':root'); // Selecciona el elemento raíz
let estilo = getComputedStyle(elemento); // Obtiene los estilos computados del elemento
let colorPrimario = estilo.getPropertyValue('--mi-color-primario'); 
let colorSecundario = estilo.getPropertyValue('--mi-color-secundario'); 
let colorTerciario = estilo.getPropertyValue('--mi-color-terciario'); 
let colorCuaternario = estilo.getPropertyValue('--mi-color-cuaternario'); 

let data_historial
let records

let sortable

// const path = require('path')
// Al cargar la página, recuperar el orden de la lista del archivo
function ordenar_lista_habitos () {
  let orden

  // Selecciona la lista
  const listaOrdenable = document.getElementById('miLista')
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
  url = '/habitos/getHabitosOnly'




  const lista = document.getElementById('miLista')
  sortable = Sortable.create(lista, {
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
        console.log(data.listaHabitos)
     
      const obj = data.listaHabitos

      // let nuevoOrden = sortable.toArray();
      const elementos_all = document.getElementById('miLista')
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

      console.log('se guardo orden json')
    })
    }
  })

  ordenar_lista_habitos()
}

// window.onload =  ordenar_lista_habitos
window.onload = eventos_lista_habitos

function leer_archivo_historial (archivo) {
  const data = fs.readFileSync(archivo, 'utf8')
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data

  // console.log(records)
  return records
}

function archivarHabito(SeVaArchivar){
  const data = fs.readFileSync('data.json', 'utf8')
  const dataJson = JSON.parse(data)

  habito = Number(document.getElementById('id').value) 
  console.log(habito)

   // Buscar el índice del objeto con el id dado
   const index = dataJson.findIndex(item => item.id === habito)

   // Si el objeto existe, actualizarlo
   if (index !== -1) {
     dataJson[index].archivado = SeVaArchivar
     fs.writeFileSync('data.json', JSON.stringify(dataJson, null, 2), 'utf8')
     console.log('guardardó')
   } else {
     // Si el objeto no existe, puedes decidir qué hacer (por ejemplo, añadirlo al array)
     console.log('El objeto con id ' + habito.id + ' no existe')
   }

   actualizar_listas()
   cambiarVentana('ventana1')


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



function actualizar_listas () {
  document.getElementById('miLista').innerHTML = ''
  document.getElementById('miLista_hechos').innerHTML = ''
  document.getElementById('miLista_archivados').innerHTML = ''

  fetch_lista_habitos()

  llenar_lista_habitos('miLista_hechos', true, false)
  llenar_lista_habitos('miLista_archivados', false, true)
  llenar_lista_habitos('miLista_archivados', true, true)
  llenar_lista_habitos('miLista', false, false)
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

function eliminar_habito () {
  const data = fs.readFileSync('data.json', 'utf8')
  let jsonData = JSON.parse(data)
  // Buscar el índice del objeto con el id dado
  const idParaEliminar = Number(document.getElementById('id').value)

  // Filtrar el array para excluir el objeto con el id dado
  jsonData = jsonData.filter(item => item.id !== idParaEliminar)

  // Guardar el nuevo array en el archivo JSON
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf8')
  console.log('Registro eliminado')
  actualizar_listas()
  cambiarVentana('ventana1')
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

  // Ordenar los datos por fecha
  datosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  console.log(datosFiltrados)

  // Calcular los días de racha
  let racha = 0
  let hoy = new Date()
  let hoy_constante = new Date()
  hoy.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

  hoy_constante = hoy_constante = new Date()
  hoy_constante.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

  hoy_racha = false

  if (!hecho) {
    hoy.setDate(hoy.getDate() - 1)
  }

  for (let i = datosFiltrados.length - 1; i >= 0; i--) {
    const fechaActual = new Date(datosFiltrados[i].fecha)
    fechaActual.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

    //  if (hoy_constante.getTime() === fechaActual.getTime()){
    //     racha++;
    //     console.log('hoy')
    // }

    // Verificar si hay datos para el día de hoy
    if (esFechaConsecutiva(fechaActual, hoy)) {
      racha++
    } else if (racha > 0) {
      break // La racha se rompe, ya hemos contado los días consecutivos hasta hoy
    }

    hoy = restarUnDia(hoy) // Restar un día a la fecha de hoy para la próxima iteración
  }

  if (id == 19) {
    console.log(id)
    console.log(racha)
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

function actualizar_horas_realizadas(){

  label_horas_completadas = document.getElementById('horas_completadas')
  horas_completadas.innerText = ''
  
  const data = fs.readFileSync('historial_habitos.csv', 'utf8');
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data;
  
  // let hoy = new Date()
  // hoy.setHours(0, 0, 0, 0)
  
  const hoy = new Date().toLocaleDateString('en-CA')
  
  const filteredData = records.filter(record => record.fecha === hoy);
  console.log('-----------')
  console.log(filteredData)
  console.log(hoy)
  
  for (let dia in filteredData){
    console.log('--eeeeeeeee-----')
    console.log(dia)
  }
  
  let totalSegundos = 0;
  
  filteredData.forEach(objeto => {
    console.log(objeto.duracion)
    
    let tiempo = objeto.duracion.split(':'); // divide la duración en horas, minutos y segundos
    let segundos = (+tiempo[0]) * 60 * 60 + (+tiempo[1]) * 60 + (+tiempo[2]); 
    totalSegundos += segundos;
  } )
  
  let horas = Math.floor(totalSegundos / 3600);
  totalSegundos %= 3600;
  let minutos = Math.floor(totalSegundos / 60);
  let segundos = totalSegundos % 60;
  
  console.log(`Duración total: ${horas}:${minutos}:${segundos}`);

  // Asegurarse de que las horas, minutos y segundos siempre tengan dos dígitos
horas = horas < 10 ? '0' + horas : horas;
minutos = minutos < 10 ? '0' + minutos : minutos;
segundos = segundos < 10 ? '0' + segundos : segundos;

console.log(`Duración total: ${horas} horas, ${minutos} minutos y ${segundos} segundos`);
  horas_completadas.innerText = `${horas}:${minutos}:${segundos}`
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



function Ver_horas_invertidas_habito(id){

  let label_horas_habito = document.getElementById('horas_invertidas_habito')
  label_horas_habito.innerText = ''
  
  const data = fs.readFileSync('historial_habitos.csv', 'utf8');
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data;

  const hoy = new Date().toLocaleDateString('en-CA')
  
  const filteredData = records.filter(record => record.id_habito === id);
  console.log('-----------')
  console.log(filteredData)
  console.log(hoy)
  
  for (let dia in filteredData){
    console.log('--eeeeeeeeemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm-----')
    console.log(dia)
  }
  
  let totalSegundos = 0;
  
  filteredData.forEach(objeto => {
    console.log(objeto.duracion)
    
    let tiempo = objeto.duracion.split(':'); // divide la duración en horas, minutos y segundos
    let segundos = (+tiempo[0]) * 60 * 60 + (+tiempo[1]) * 60 + (+tiempo[2]); 
    totalSegundos += segundos;
  } )
  
  let horas = Math.floor(totalSegundos / 3600);
  totalSegundos %= 3600;
  let minutos = Math.floor(totalSegundos / 60);
  let segundos = totalSegundos % 60;
  
  console.log(`Duración total: ${horas}:${minutos}:${segundos}`);

  // Asegurarse de que las horas, minutos y segundos siempre tengan dos dígitos
horas = horas < 10 ? '0' + horas : horas;
minutos = minutos < 10 ? '0' + minutos : minutos;
segundos = segundos < 10 ? '0' + segundos : segundos;

console.log(`Duración total: ${horas} horas, ${minutos} minutos y ${segundos} segundos`);
label_horas_habito.innerHTML = `Total de tiempo: <strong class="horas_css">${horas}</strong> horas: <strong class="minutos_css">${minutos}</strong> min: <strong class="seg_css">${segundos}</strong> seg`
}

function dias_totales_invertidos_habito(id){

  let label_horas_habito = document.getElementById('dias_totales_invertidas_habito')
  label_horas_habito.innerText = ''
  
  const data = fs.readFileSync('historial_habitos.csv', 'utf8');
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data;

  const hoy = new Date().toLocaleDateString('en-CA')
  
  const filteredData = records.filter(record => record.id_habito === id);
label_horas_habito.innerHTML = `Total de días: <strong class="minutos_css">${filteredData.length}</strong>`
}


function obtenerObjetoHabito(id) {
  const data = fs.readFileSync('data.json', 'utf8')
  let jsonData = JSON.parse(data)
  jsonData = jsonData.filter(item => item.id == Number(id))

  return jsonData[0]

}