/**
 * Estadísticas por Tags - Sistema de gráficos y análisis
 * Utiliza Chart.js para generar visualizaciones dinámicas
 */

// Variables globales para los gráficos
let graficoDistribucion = null;
let graficoTendencia = null;
let graficoComparacion = null;
let graficoRegularidad = null;

// Variables de datos
let datosEstadisticas = {};
let tagsDisponibles = [];
let filtroActual = {
    tag: '',
    periodo: 30
};

/**
 * Inicializa el sistema de estadísticas por tags
 */
function inicializarEstadisticasTags() {
    console.log('🚀 Inicializando estadísticas por tags...');
    
    // Cargar tags disponibles
    cargarTagsDisponibles();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Cargar datos iniciales
    cargarDatosEstadisticas();
}

/**
 * Configura los event listeners para filtros y controles
 */
function configurarEventListeners() {
    // Botón aplicar filtros
    document.getElementById('aplicar-filtros').addEventListener('click', aplicarFiltros);
    
    // Cambios en filtros
    document.getElementById('tag-filter').addEventListener('change', actualizarFiltros);
    document.getElementById('periodo-filter').addEventListener('change', actualizarFiltros);
}

/**
 * Carga la lista de tags disponibles
 */
async function cargarTagsDisponibles() {
    try {
        const response = await fetch('/habitos/get_tags/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            tagsDisponibles = data.tags || [];
            actualizarSelectTags();
        }
    } catch (error) {
        console.error('Error cargando tags:', error);
    }
}

/**
 * Actualiza el select de tags con los tags disponibles
 */
function actualizarSelectTags() {
    const select = document.getElementById('tag-filter');
    
    // Limpiar opciones existentes (excepto "Todos")
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Agregar tags disponibles
    tagsDisponibles.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.id;
        option.textContent = tag.nombre;
        option.style.color = tag.color;
        select.appendChild(option);
    });
}

/**
 * Actualiza los filtros cuando cambian los controles
 */
function actualizarFiltros() {
    filtroActual.tag = document.getElementById('tag-filter').value;
    filtroActual.periodo = document.getElementById('periodo-filter').value;
}

/**
 * Aplica los filtros y recarga los datos
 */
function aplicarFiltros() {
    actualizarFiltros();
    cargarDatosEstadisticas();
}

/**
 * Carga los datos de estadísticas desde el servidor
 */
async function cargarDatosEstadisticas() {
    try {
        console.log('📊 Cargando datos de estadísticas...');
        
        const response = await fetch('/habitos/get_estadisticas_tags/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(filtroActual)
        });
        
        if (response.ok) {
            datosEstadisticas = await response.json();
            console.log('Datos recibidos:', datosEstadisticas);
            
            // Actualizar todas las visualizaciones
            actualizarResumenEstadisticas();
            actualizarGraficos();
            actualizarTablaDetallada();
        } else {
            console.error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        // Usar datos de prueba si hay error
        usarDatosPrueba();
    }
}

/**
 * Usa datos de prueba cuando no hay conexión con el servidor
 */
function usarDatosPrueba() {
    console.log('📝 Usando datos de prueba...');
    
    datosEstadisticas = {
        resumen: {
            tiempoTotal: { horas: 45, minutos: 30 },
            tagMasActivo: 'Trabajo',
            diaMasProductivo: '2024-01-15',
            promedioDiario: { horas: 2, minutos: 15 }
        },
        distribucionTags: [
            { tag: 'Trabajo', tiempo: 1800, color: '#3B82F6' },
            { tag: 'Ejercicio', tiempo: 900, color: '#10B981' },
            { tag: 'Estudio', tiempo: 1200, color: '#F59E0B' },
            { tag: 'Lectura', tiempo: 600, color: '#EF4444' }
        ],
        tendenciaTemporal: {
            labels: ['2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14'],
            datasets: [
                {
                    label: 'Trabajo',
                    data: [120, 150, 180, 90, 200],
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6'
                },
                {
                    label: 'Ejercicio', 
                    data: [60, 45, 90, 75, 60],
                    backgroundColor: '#10B981',
                    borderColor: '#10B981'
                }
            ]
        },
        comparacionDiaria: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Tiempo promedio (minutos)',
                data: [180, 150, 200, 120, 160, 90, 60],
                backgroundColor: 'rgba(59, 130, 246, 0.8)'
            }]
        },
        regularidad: {
            labels: ['Muy Regular', 'Regular', 'Irregular', 'Muy Irregular'],
            data: [40, 35, 20, 5],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280']
        }
    };
    
    actualizarResumenEstadisticas();
    actualizarGraficos();
    actualizarTablaDetallada();
}

/**
 * Actualiza el resumen de estadísticas principales
 */
function actualizarResumenEstadisticas() {
    const resumen = datosEstadisticas.resumen || {};
    
    // Total de tiempo
    const tiempoTotal = resumen.tiempoTotal || { horas: 0, minutos: 0 };
    document.getElementById('total-tiempo-tags').textContent = 
        `${tiempoTotal.horas}h ${tiempoTotal.minutos}m`;
    
    // Tag más activo
    document.getElementById('tag-mas-activo').textContent = 
        resumen.tagMasActivo || '-';
    
    // Día más productivo
    const diaMasProductivo = resumen.diaMasProductivo || '-';
    document.getElementById('dia-mas-productivo').textContent = 
        diaMasProductivo !== '-' ? formatearFecha(diaMasProductivo) : '-';
    
    // Promedio diario
    const promedioDiario = resumen.promedioDiario || { horas: 0, minutos: 0 };
    document.getElementById('promedio-diario-tags').textContent = 
        `${promedioDiario.horas}h ${promedioDiario.minutos}m`;
}

/**
 * Actualiza todos los gráficos
 */
function actualizarGraficos() {
    actualizarGraficoDistribucion();
    actualizarGraficoTendencia();
    actualizarGraficoComparacion();
    actualizarGraficoRegularidad();
}

/**
 * Actualiza el gráfico de distribución por tags (gráfico de dona)
 */
function actualizarGraficoDistribucion() {
    const ctx = document.getElementById('grafico-distribucion-tags').getContext('2d');
    
    if (graficoDistribucion) {
        graficoDistribucion.destroy();
    }
    
    const distribucion = datosEstadisticas.distribucionTags || [];
    
    graficoDistribucion = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: distribucion.map(item => item.tag),
            datasets: [{
                data: distribucion.map(item => item.tiempo),
                backgroundColor: distribucion.map(item => item.color),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const minutos = context.parsed;
                            const horas = Math.floor(minutos / 60);
                            const mins = minutos % 60;
                            return `${context.label}: ${horas}h ${mins}m`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Actualiza el gráfico de tendencia temporal (líneas)
 */
function actualizarGraficoTendencia() {
    const ctx = document.getElementById('grafico-tendencia-tags').getContext('2d');
    
    if (graficoTendencia) {
        graficoTendencia.destroy();
    }
    
    const tendencia = datosEstadisticas.tendenciaTemporal || { labels: [], datasets: [] };
    
    graficoTendencia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tendencia.labels,
            datasets: tendencia.datasets.map(dataset => ({
                ...dataset,
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo (minutos)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                }
            }
        }
    });
}

/**
 * Actualiza el gráfico de comparación diaria (barras)
 */
function actualizarGraficoComparacion() {
    const ctx = document.getElementById('grafico-comparacion-diaria').getContext('2d');
    
    if (graficoComparacion) {
        graficoComparacion.destroy();
    }
    
    const comparacion = datosEstadisticas.comparacionDiaria || { labels: [], datasets: [] };
    
    graficoComparacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: comparacion.labels,
            datasets: comparacion.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo (minutos)'
                    }
                }
            }
        }
    });
}

/**
 * Actualiza el gráfico de regularidad (polar area)
 */
function actualizarGraficoRegularidad() {
    const ctx = document.getElementById('grafico-regularidad').getContext('2d');
    
    if (graficoRegularidad) {
        graficoRegularidad.destroy();
    }
    
    const regularidad = datosEstadisticas.regularidad || { labels: [], data: [], backgroundColor: [] };
    
    graficoRegularidad = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: regularidad.labels,
            datasets: [{
                data: regularidad.data,
                backgroundColor: regularidad.backgroundColor,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Actualiza la tabla detallada de estadísticas
 */
function actualizarTablaDetallada() {
    const tbody = document.getElementById('tabla-stats-body');
    tbody.innerHTML = '';
    
    const distribucion = datosEstadisticas.distribucionTags || [];
    
    distribucion.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full mr-2" style="background-color: ${item.color}"></div>
                    ${item.tag}
                </div>
            </td>
            <td class="px-4 py-2">${Math.floor(item.tiempo / 60)}h ${item.tiempo % 60}m</td>
            <td class="px-4 py-2">${item.sesiones || 0}</td>
            <td class="px-4 py-2">${item.promedioSesion || 0}m</td>
            <td class="px-4 py-2">${formatearFecha(item.ultimoUso) || '-'}</td>
            <td class="px-4 py-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTendenciaClase(item.tendencia)}">
                    ${item.tendencia || 'Estable'}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Funciones auxiliares
 */
function formatearFecha(fecha) {
    if (!fecha) return '-';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getTendenciaClase(tendencia) {
    switch (tendencia) {
        case 'Subiendo':
            return 'bg-green-100 text-green-800';
        case 'Bajando':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

/**
 * Funciones de exportación y actualización
 */
function exportarEstadisticasTags() {
    console.log('📤 Exportando estadísticas...');
    
    // Crear datos para exportar
    const datosExportar = {
        fecha: new Date().toISOString(),
        filtros: filtroActual,
        resumen: datosEstadisticas.resumen,
        detalles: datosEstadisticas.distribucionTags
    };
    
    // Crear y descargar archivo JSON
    const blob = new Blob([JSON.stringify(datosExportar, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas_tags_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function refrescarEstadisticasTags() {
    console.log('🔄 Refrescando estadísticas...');
    cargarDatosEstadisticas();
}

// Función para obtener cookie CSRF (ya existe en el template principal)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Inicializar cuando se cargue la ventana
if (typeof inicializarEstadisticasTags !== 'undefined') {
    console.log('🎯 Módulo de estadísticas por tags cargado');
} 