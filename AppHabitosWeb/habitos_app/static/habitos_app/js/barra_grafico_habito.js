
  let currentYearIndex_graf = 0;
  let currentChart_graf = null;
  let years_graf = []; // Definir la variable years en un ámbito más amplio
  let duracionesPorAnio_graf = {}; // Hacer duracionesPorAnio global

  function generarGraficoDuracionPorAnio(id, valorObjetivo) {
    currentYearIndex_graf = 0;
    duracionesPorAnio_graf = {}; // Limpiar duracionesPorAnio

    url = `/habitos/getHistorialHabitosBar/${id}`
    console.log('barra')

    // const data = fs.readFileSync('historial_habitos.csv', 'utf8');
    // const records = Papa.parse(data, {
    //   header: true,
    //   skipEmptyLines: true
    // }).data;

    fetch(url)
    .then(function(response){
        if (!response.ok){
            throw new Error('error')
        }
        return response.json()
    })
    .then(function(data){
        console.log('si encontro')
        console.log(data)

        console.log(data.data_historial)

        

  
   

    // const filteredData = records.filter(record => record.id_habito === id);
    const filteredData = data.data_historial

    filteredData.forEach(record => {
      const fecha = new Date(record.fecha);
      const anio = fecha.getFullYear();

      if (!duracionesPorAnio_graf[anio]) {
        duracionesPorAnio_graf[anio] = {};
      }

      const diaDelAnio = Math.floor((fecha - new Date(anio, 0, 0)) / (1000 * 60 * 60 * 24));
    //   const duracionArray = record.duracion.split(':').map(Number);
      const duracionEnMinutos = record.duracion

      if (!duracionesPorAnio_graf[anio][diaDelAnio]) {
        duracionesPorAnio_graf[anio][diaDelAnio] = 0;
      }

      duracionesPorAnio_graf[anio][diaDelAnio] += duracionEnMinutos;
    });

    years_graf = Object.keys(duracionesPorAnio_graf);

    function updateChart_graf(year) {
      console.log(duracionesPorAnio_graf);
      const diasDelAnio = 365;
      let duraciones = Array.from({ length: diasDelAnio }, () => 0);
      let labels = Array.from({ length: diasDelAnio }, (_, idx) => {
        const fecha = new Date(new Date(year, 0));
        fecha.setDate(idx + 1);
        return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      });

      if (duracionesPorAnio_graf[year]) {
        duraciones = Array.from({ length: diasDelAnio }, (_, idx) => duracionesPorAnio_graf[year][idx] || 0);
      }

      if (currentChart_graf) {
        currentChart_graf.destroy();
      }

      let datosObjetivo = labels.map(() => valorObjetivo);

      const ctx = document.getElementById('myChart');
      ctx.style.height = '100px';
      currentChart_graf = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `${year}-min`,
            data: duraciones,
            borderColor: colorSecundario,
            backgroundColor: colorSecundario,
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
              beginAtZero: true,
              title: {
                display: true,
                text: 'Horas'
              }
            },
            x: {
              display: true,
              title: {
                display: true,
                text: 'Fechas'
              }
            }
          }
        },
        plugins: {
          title: {
            display: false,
            text: 'Título del gráfico'
          }
        }
      });



      
    }

    function handlePrevButtonClick() {
      if (currentYearIndex_graf > 0) {
        currentYearIndex_graf--;
        updateChart_graf(years_graf[currentYearIndex_graf]);
      }
    }

    function handleNextButtonClick() {
      if (currentYearIndex_graf < years_graf.length - 1) {
        currentYearIndex_graf++;
        updateChart_graf(years_graf[currentYearIndex_graf]);
      }
    }

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.removeEventListener('click', handlePrevButtonClick);
    nextButton.removeEventListener('click', handleNextButtonClick);

    prevButton.addEventListener('click', handlePrevButtonClick);
    nextButton.addEventListener('click', handleNextButtonClick);


    const latestYear = years_graf.reduce((latest, year) => (parseInt(year) > parseInt(latest) ? year : latest), years_graf[0]);

    // Mostrar primero el año más reciente
    currentYearIndex_graf = years_graf.indexOf(latestYear);

    updateChart_graf(years_graf[currentYearIndex_graf]);
  
})
}
