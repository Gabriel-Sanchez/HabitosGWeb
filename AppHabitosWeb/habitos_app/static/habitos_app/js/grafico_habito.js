
// const CalHeatMap = require('cal-heatmap');
// const { duration } = require('moment');

function transformDateToTimeZone(date, timezone) {
  let dateInMilliseconds = date.getTime();
  let dateInTimeZone = new Date(new Date(dateInMilliseconds).toLocaleString("en-US", {timeZone: timezone}));
  return dateInTimeZone;
}

function fillDataFormHistorial(tiempoInicial){
  var horas = Math.floor(tiempoInicial / 60);
  var minutos = Math.floor(tiempoInicial % 60);
  var segundos = Math.round((tiempoInicial % 1) * 60);
    document.getElementById('hora').value = horas;
  document.getElementById('minutos').value = minutos;
  document.getElementById('segundos').value = segundos;
}

function breakdownTimeforMinutes(tiempoInicial){
  var horas = Math.floor(tiempoInicial / 60);
  var minutos = Math.floor(tiempoInicial % 60);
  var segundos = Math.round((tiempoInicial % 1) * 60);
  return [horas, minutos, segundos]
}


function getformatDate(date){
  let dia = date.getDate();
let mes = date.getMonth() + 1; // Los meses en JavaScript empiezan en 0
let ano = date.getFullYear();

// Asegurándose de que el día y el mes sean de dos dígitos
if (dia < 10) dia = '0' + dia;
if (mes < 10) mes = '0' + mes;

let fecha = `${ano}-${mes}-${dia}`;
return fecha
}

function holaa2(){
  console.log('holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaholaaaaaaaaaaaaaa')
}


function fetchDetallesHabito(id_habito){

  url = `/habitos/getHistorialHabito/${id_habito}`

  return fetch(url)
  .then(function(response){
      if (!response.ok){
          throw new Error('error')
      }
      return response.json()
  })
}

var data = {
 '2023-12-18': 5,
 '2023-12-19': 10,
 '2023-12-20': 3,
 '2023-12-21': 8,
 '2023-12-22': 6,
 '2023-12-23': 12,
 '2023-12-24': 4,
 '2023-1-1': 24,
 '2023-2-4': 64,
};

var datasjs = {};

Object.keys(data).forEach(function(key) {
 var date = new Date(key);
 var timestamp = Math.floor(date.getTime() / 1000); // Convertir la fecha a timestamp UNIX

 // Transformar los valores como se desee
 var transformedValue = data[key] * 0.5; // Solo un ejemplo de transformación

 datasjs[timestamp] = transformedValue; // Asignar el valor transformado al nuevo objeto
});

console.log(datasjs); // Mostrar el nuevo objeto con fechas en formato timestamp y valores transformados




// const fs = require('fs');
// const Papa = require('papaparse');

function mostrar_datos(dateBase, nb, idHabito){
  console.log(dateBase)

  holaa2()
 let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
 let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  date = new Date(dateBase)
   console.log(date)



  // let dateBase = new Date(); // Asegúrate de definir tu fecha base
  // let date = new Date(datea.toLocaleString("es-PA", {timeZone: "America/Panama"}));
  // date.setGlobalTimeZone('America/Panama');
  // date2 = new Date(dateBase)
  // datePa = date.toLocaleString("es-PA", {timeZone: "America/Panama"});
  // date = new Date(datePa);

//   let fechaSec = new Date(dateBase); // Tu fecha base en milisegundos
// let date = transformDateToTimeZone(fechaSec, 'America/Panama');
 
  let diaSemana = dias[date.getUTCDay()];
 let ano = date.getUTCFullYear();
 let mes = meses[date.getUTCMonth() ];
 let dia = date.getUTCDate()
// console.log(date)
// console.log(date.getDate())
// let diaSemana = dias[date.getDay()];
//  console.log(diaSemana)
// let ano = date.getFullYear();
// let mes = meses[date.getMonth()];
// let dia = date.getDate();



 console.log(`La fecha es ${diaSemana}, ${dia} de ${mes} del año ${ano}`);


 let fecha = date.toISOString().split('T')[0];
// let fecha = getformatDate(date)
 console.log(fecha)






  get_datos_historial(idHabito, fecha,'historial_habitos.csv' )
 .then(function(datos_historial){
   
   if (nb === null){
     resultado = 'sin registro <br>'
    //  duracion_historial = document.getElementById("duracion_historial").value = '0:0:0'
     var tiempoInicial = 0;
     fillDataFormHistorial(tiempoInicial)
     
    }else{
      console.log('-----aaaaaaeeeeeeeeeeeeeeeeaaaaaaaaaaaa-----------')
    console.log(datos_historial)
    objeto_habito = datos_historial.objeto_habito
    console.log(datos_historial.objeto_historial)
    console.log('historialll')
    console.log(datos_historial.objeto_historial['duracion'])
  //  duracion_historial = document.getElementById("duracion_historial").value = datos_historial.objeto_historial['duracion']
  var tiempoInicial = datos_historial.objeto_historial['duracion'];
  fillDataFormHistorial(tiempoInicial)
   var objetoDatos_historial = document.getElementById("objeto_historial");
   objetoDatos_historial.dataset.objeto = JSON.stringify(datos_historial);
   console.log("Objeto guardado en atributo de datos.");
   // console.log("objeto_guardado:",objeto_habito)
   
   let [horas, minutos, segundos ] = breakdownTimeforMinutes(tiempoInicial)
   let [horasD, minutosD, segundosD ] = breakdownTimeforMinutes(datos_historial.objeto_historial['duracion_descanso'])
   resultado = ` <br>  La fecha es ${diaSemana}, ${dia} de ${mes} del año ${ano} </br>  
   <br> Concentración: ${horas}:${minutos}:${segundos} - Descanso: ${horasD}:${minutosD}:${segundosD} <br/> 
   <br> Hora de inicio: ${ datos_historial.objeto_historial['hora_inicio']} - Hora de fin: ${ datos_historial.objeto_historial['hora_fin']}  <br/> `
 
   var objetoDatos = document.getElementById("objeto_habito_edicion");
   // objeto_habito = obtenerObjetoHabito(id_historial)
   objetoDatos.dataset.objeto = JSON.stringify(objeto_habito);
   console.log("Objeto guardado en atributo de datos.");
   console.log("objeto_guardado:",objeto_habito)
  }




 
 document.getElementById('form_edicion_historial').style.display = 'none'
 
 document.getElementById('onClick-placeholder').innerHTML = `
 
 <!-- <b>${date}</b>  -->
 <br/> <b>${resultado}</b> <br/>
 
 
 <button class="boton_editarHistorial rounded-sm pl-4 pr-4 pt-1 pb-1" id="boton_visibleEdicionHistorial" onclick="visibleEdicionHistorial()">Editar</button>
 
 <!-- with 
 
 
 <b>${(nb === null ? 'unknown' : nb)}</b> items -->
 `;
 
 
 id_historial = document.getElementById("id_historial_habito").value = idHabito
 fecha_historial = document.getElementById("fecha_historial").value = fecha
 console.log(id_historial)
 
 
 
 

  })



}





function transformarDatos(idHabito, archivo) {

    url = `/habitos/getHistorialHabito/${idHabito}`

    fetch(url)
    .then(function(response){
        if (!response.ok){
            throw new Error('error')
        }
        return response.json()
    })
    .then(function(data){

        console.log(data.lista_HistorialHabito)
   



//    const data = fs.readFileSync(archivo, 'utf8');
//    const records = Papa.parse(data, {
//        header: true,
//        skipEmptyLines: true
//    }).data;

//    let datasjs = {};
//    for (let record of data.lista_HistorialHabito) {
//        if (parseInt(record.id_habito) === idHabito) {
//            //let fecha = record.fecha;
//            let duracion = record.duracion;
//            // Convertir la fecha a timestamp
//            //let timestamp = Math.floor(new Date(fecha).getTime() / 1000);

//            let fecha = record.fecha.split('-'); // Suponiendo que la fecha está en formato 'YYYY-MM-DD'
//              console.log(fecha)
//            //let timestamp = Date.UTC(fecha[0], fecha[1] - 1, fecha[2] ) / 1000;

//            let fechaUTC = new Date(Date.UTC(fecha[0], fecha[1] - 1, fecha[2]));
//            let fechaLocal = fechaUTC.toLocaleString();
//            fechaUTC.setDate(fechaUTC.getDate() + 1); 
//            let timestamp = fechaUTC.getTime() / 1000;

//            //let timestamp = Math.floor(new Date(fechaLocal).getTime() / 1000);
//            // Convertir la duración a minutos
//         //    let [h, m, s] = duracion.split(':').map(Number);
//         //    let minutos = h * 60 + m + s / 60;
//         //    minutos = Math.trunc(minutos * 100) / 100;
//            console.log(fecha)
//            console.log(duracion)
//         //    console.log(minutos)
//         //    datasjs[timestamp] = minutos;
//            datasjs[timestamp] = duracion;
//        }
//    }
//    console.log(datasjs);

//    datasjs = datasjs =  {
//     "1258185600": 2.77,
//     "1258272000": 2.52,
//     "1258358400": 3.23,
//     "1258444800": 2.06,
//     "1258617600": 2.62,
//     "1258704000": 3.9,
//     "1258790400": 3.41,
//     "1258963200": 0,
//     "1259049600": 0,
//     "1259136000": 3.16,
//     "1259308800": 2.97,
//     "1259395200": 2.79,
//     "1259481600": 3.65,
//     "1259654400": 1.9,
//     "1259740800": 3.46,
//     "1259827200": 3.93,
//     "1260000000": 4.1
//   }
  
  
//    var cal = new CalHeatMap();
//    cal.init({
//        data: datasjs,
//        start: new Date(),
//        id: "cal-heatmap",
//        domain: "year",
//        range: 1,
//        cellRadius: 3,
//        subDomain: "day",
//        cellSize: 15,
//        highlight: "now",
//        itemName: "minuto",
//        previousSelector: '#minDate-previous_year',
//        nextSelector: '#minDate-next_year',
//        onClick: function (date, nb) {
//            mostrar_datos(date, nb)
//        },
//        tooltip: true,
//        legend: [5, 25, 50 , 100],
//        legendColors: {
//            min: "#49c94f",
//            max: "#055585",
//            empty: "white",
//            base: "#525467",
//            overflow: "black"
//        },
//    });
   
//    var cal2 = new CalHeatMap();
//    cal2.init({
//        itemSelector: '#mes_habito',
//        domain: 'month',
//        subDomain: 'x_day',
//        data: datasjs,
//        start: new Date(),
//        highlight: "now",
//        cellSize: 20,
//        cellRadius: 3,
//        cellPadding: 5,
//        range: 1,
//        domainMargin: 20,
//        animationDuration: 800,
//        domainDynamicDimension: false,
//        previousSelector: '#minDate-previous',
//        nextSelector: '#minDate-next',
//        itemName: "minuto",
//        tooltip: true,
//        subDomainTextFormat: '%d',
//        label: {
//            position: 'left',
//            offset: {
//                x: 20,
//                y: 35,
//            },
//            width: 100,
//        },
//        onClick: function (date, nb) {
//            mostrar_datos(date, nb)
//        },
//        legend: [1,2],
//        legendColors: {
//         min: "#525467",
//         max: "#055585",
//         empty: "red", // Añade esta línea
//         base: "red",
//         overflow: "gray"
//     }
//    });
   let today = new Date()
let todayHeatmap = today.toLocaleDateString("es-PA", {timeZone: "America/Panama"})
console.log(todayHeatmap)
//    nuevo cal-heatmap
const calAnio = new CalHeatmap();
calAnio.paint(
    {
      data: { source: data.data_historial, x: "fecha", y: "duracion" },
      date: { start: new Date(new Date().getFullYear(), 0, 1),    highlight: [
        new Date(todayHeatmap),
      ], timezone: 'America/Panama' },
      // range: 1,
      range: 12,
      scale: {
        color: {
            // domain: [0, 10, 30, 60, 120],
            // range: ['#5cff64',  '#055585'],
            // // interpolate: 'rgb',
            // // interpolate: 'rgb',
            // interpolate: d3.interpolateRgb.gamma(2.2),
            // type: 'linear',
            // scheme: 'YlOrRd'
            range: ['#bfbfbf','#49c94f', '#055585'],
            interpolate: 'hsl',
             type: 'linear',
            // domain: [0, 30, 60, 80, 120],
            domain: [0,1, 120],
            // domain: [0, 5, 25, 50, 100, 120],
        },
      },
      // domain: {
      //   type: "year",
      // },
      // subDomain: { type: "day", radius: 3 , width: 15, height: 15 },
      domain: {
        type: 'month',
        gutter: 5,
        label: { text: 'MMM', textAlign: 'start', position: 'top' },
      },
      subDomain: { type: 'ghDay', radius: 2, width: 14, height: 14, gutter: 3 },
      itemSelector: "#cal-heatmap",
      theme: 'dark',
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              "Min: " + (value ? value : 0) + "." + dayjsDate.format("LL")
            );
          },
        },
      ],
      [
        CalendarLabel,
        {
          width: 30,
          textAlign: 'start',
          text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? '' : d)),
          padding: [25, 0, 0, 0],
        },
      ],
      // [
        
      //   // LegendLite, { itemSelector: '#legendY', includeBlank: true }
      //   Legend,
      //   {
      //     tickSize: 0,
        
      //     itemSelector: "#legendMes",
      //     label: "",
      //   },
      
      
      // ],
    //   [
    //     Legend,
    //     {
    //       tickSize: 0,
    //       width: 150,
    //       itemSelector: '#legendY',
    //       label: '',
    //     },
    //   ],
    ]
  );

  calAnio.on('click', (event, timestamp, value) => {
    mostrar_datos(timestamp, value, idHabito)
    console.log(
      'On <b>' +
        new Date(timestamp).toLocaleDateString() +
        '</b>, the max temperature was ' +
        value +
        '°C'
    );
  });

  const prevButton = document.getElementById('minDate-previous_year');
const nextButton = document.getElementById('minDate-next_year');

// Agregar eventos de clic a los botones
prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    calAnio.previous();
});

nextButton.addEventListener('click', function(e) {
    e.preventDefault();
    calAnio.next();
});


const calMes = new CalHeatmap();
calMes.paint(
    {
      data: { source: data.data_historial, x: "fecha", y: "duracion" },
      date: { start: new Date(),    highlight: [
        new Date(todayHeatmap),
      ], },
      range: 1,
      scale: {
        color: {
            range: ['#49c94f', '#055585'],
            interpolate: 'hsl',
            type: 'linear',
            domain: [0, 30, 60, 120],
        },
      },
      domain: {
        type: "month",
        padding: [10, 10, 10, 10],
        label: { position: 'top' },
      },
      subDomain: { type: 'xDay', radius: 2, width: 20, height: 20, label: 'D' },
      itemSelector: "#mes_habito",
      theme: 'dark',
      
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              "Min: " + (value ? value : 0) + "." + dayjsDate.format("LL")
            );
          },
        },
      ],
      [
        Legend,
        {
          tickSize: 0,
        
          itemSelector: "#legendMes",
          label: "",
        },
      ],
    ]
  );

  calMes.on('click', (event, timestamp, value) => {
    mostrar_datos(timestamp, value, idHabito)
    console.log(
      'On <b>' +
        new Date(timestamp).toLocaleDateString() +
        '</b>, the max temperature was ' +
        value +
        '°C'
    );
  });

  const prevButtoncalMes = document.getElementById('minDate-previous');
const nextButtoncalMes = document.getElementById('minDate-next');

// Agregar eventos de clic a los botones
prevButtoncalMes.addEventListener('click', function(e) {
    e.preventDefault();
    calMes.previous();
});

nextButtoncalMes.addEventListener('click', function(e) {
    e.preventDefault();
    calMes.next();
});
   

       
 /*
   document.getElementById('minDate-previous').addEventListener('click', function(e) {
     e.preventDefault();
     if (!cal.previous()) {
         this.disabled = true; // Desactiva el botón 'minDate-previous'
     }
     document.getElementById('minDate-next').disabled = false; // Activa el botón 'minDate-next'
 });
 
 document.getElementById('minDate-next').addEventListener('click', function(e) {
     e.preventDefault();
     if (!cal.next()) {
         this.disabled = true; // Desactiva el botón 'minDate-next'
     }
     document.getElementById('minDate-previous').disabled = false; // Activa el botón 'minDate-previous'
 });
 */
 
})
}

// Uso de la función

var valor_completo


function definir(value) {
 //const { ipcRenderer } = require('electron')

    // ipcRenderer.on('button-value', function (event, value) {
       
         document.getElementById('cal-heatmap').innerHTML = "";
         document.getElementById('mes_habito').innerHTML = "";

         document.getElementById('header').innerText = value.nombre;

         valor_completo = value
         document.getElementById('onClick-placeholder').innerHTML = ''
         document.getElementById('form_edicion_historial').style.display = 'none'

         transformarDatos(value.id, 'historial_habitos.csv');

         fetchDetallesHabito(value.id)
         .then(function(data){
          console.log(data.TotalTiempo)
          Ver_horas_invertidas_habito(data.TotalTiempo)
          dias_totales_invertidos_habito(data.TotalDias)
        })

        

         let botones_prev_next = document.getElementsByClassName('botones_nyp')
         for (let boton of botones_prev_next) {
          boton.style.display = 'block';
        }

        
   //  });
 
}

//definir()



function mostrar_flechas() {
  var x = document.getElementsByClassName('center_div');
  
  for(var i =0; i < x.length; i++){

    if (x[i].style.display === "none") {
      x[i].style.display = "block";
    } 
  }
}

function convertirATiempoEnMinutos(tiempo) {
  let partes = tiempo.split(':');
  let horas = parseInt(partes[0]);
  let minutos = parseInt(partes[1]);
  let segundos = parseInt(partes[2]);
  return horas * 60 + minutos + segundos / 60;
}


function graficar_semana(id, valorObjetivo) {
    // Leer los datos del archivo CSV
    // const datos = fs.readFileSync('historial_habitos.csv', 'utf8');
    // const registros = Papa.parse(datos, {
    //     header: true,
    //     skipEmptyLines: true
    // }).data;

    url = `/habitos/getHistorialHabito/${id}`

    fetch(url)
    .then(function(response){
        if (!response.ok){
            throw new Error('error')
        }
        return response.json()
    })
    .then(function(data){

      const registros = data.data_historial


    let hoy_fecha = new Date();
    let diaSemana_fecha = hoy_fecha.getDay();
    let lunes_fecha = new Date(hoy_fecha);
    lunes_fecha.setDate(hoy_fecha.getDate() - diaSemana_fecha + (diaSemana_fecha == 0 ? -6 : 1)); // Ajusta al lunes de esta semana
    let domingo_fecha = new Date(lunes_fecha);
    domingo_fecha.setDate(lunes_fecha.getDate() + 6);

    // Obtener la fecha actual y la fecha del lunes de esta semana
    let fechaActual = new Date();
    let diaDeLaSemana = fechaActual.getDay();
    let lunesDeEstaSemana = new Date(fechaActual.setDate(fechaActual.getDate() - diaDeLaSemana + (diaDeLaSemana === 0 ? -7 : 1)));

    lunesDeEstaSemana.setHours(0, 0, 0, 0)
    console.log('lunesDeEstaSemana')
    console.log(lunesDeEstaSemana)
    console.log('lunesDeEstaSemana')



    // Filtrar los datos para obtener solo los de esta semana y el id especificado
    let registrosDeEstaSemana = registros.filter(registro => {
        let fechaDelRegistro = new Date(registro.fecha);
        fechaDelRegistro.setHours(0, 0, 0, 0)
        lunesDeEstaSemana.setDate(lunesDeEstaSemana.getDate() - 1);

        return fechaDelRegistro >= lunesDeEstaSemana && registro.id_habito == id;
    });
    
    console.log('-rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    console.log(registrosDeEstaSemana)
    console.log('-rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')

    // Preparar los datos para el gráfico
    let etiquetas = registrosDeEstaSemana.map(registro => registro.fecha);
    // let datosParaElGrafico = registrosDeEstaSemana.map(registro => registro.duracion);
    let datosParaElGrafico = registrosDeEstaSemana.map(registro => registro.duracion);
    let objeto_fecha = Object.fromEntries(etiquetas.map((key, i) => [key, datosParaElGrafico[i]]));
    console.log(datosParaElGrafico)

    let nombresPorDia = [
      'Lun',
      'Mar',
      'Mié',
      'Jue',
      'Vie',
      'Sáb',
      'Dom'
    ]
    idx_dia = 0
     
    let dataCompleta = {};
    lunes_fecha = moment(lunes_fecha);
    domingo_fecha = moment(domingo_fecha)

    while (lunes_fecha <= domingo_fecha) {
      let fechaStr =  lunes_fecha.format("YYYY-MM-DD");
      dataCompleta[nombresPorDia[idx_dia]+'-'+fechaStr.split("-")[2]] = objeto_fecha[fechaStr] || 0;
      lunes_fecha.add(1, 'days');
      idx_dia = idx_dia + 1
}

console.log(dataCompleta)

etiquetas = Object.keys(dataCompleta);
datosParaElGrafico = Object.values(dataCompleta);

//let valorObjetivo = 5; // Cambia esto por tu valor objetivo

// Crear un array con el valor objetivo para cada día de la semana
let datosObjetivo = etiquetas.map(() => valorObjetivo);

    // Crear el gráfico con Chart.js
    let contexto = document.getElementById('miGrafico').getContext('2d');
    if(window.miGrafico instanceof Chart) {
        window.miGrafico.destroy(); // Destruir el gráfico anterior si existe
    }
    window.miGrafico = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Duración',
                data: datosParaElGrafico,
                backgroundColor: colorSecundario,
                borderColor: colorTerciario,
                borderWidth: 1
            }, {
              label: 'Valor Objetivo',
              data: datosObjetivo,
              type: 'line',
              fill: false,
              borderColor: colorPrimario,
              backgroundColor: colorPrimario,
              pointRadius: 0,
              borderWidth: 2,
              
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

  })
}

// Llamar a la función con el id que quieres graficar





function visibleEdicionHistorial(){
  document.getElementById('boton_visibleEdicionHistorial').style.display = 'none'
  document.getElementById('form_edicion_historial').style.display = 'flex'
}


