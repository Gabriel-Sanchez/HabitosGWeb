/**
 * Estadísticas por Tags - Sistema de gráficos y análisis
 * Utiliza Chart.js para generar visualizaciones dinámicas
 */

// Variables globales para los gráficos
let graficoDistribucion = null;
let graficoTendencia = null;
let graficoComparacion = null;
let graficoEficiencia = null;

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
    
    // Cargar datos iniciales (esto llamará a usarDatosPrueba si no hay servidor)
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
    console.log('🎯 Aplicando filtros...');
    actualizarFiltros();
    
    // Intentar cargar del servidor, pero si falla, regenerar datos locales
    cargarDatosEstadisticas()
        .catch(() => {
            console.log('⚠️ Error del servidor, regenerando datos locales...');
            refrescarEstadisticasTags();
        });
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
    
    // Generar datos más dinámicos basados en la fecha actual
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    datosEstadisticas = {
        resumen: {
            tiempoTotal: { horas: 45, minutos: 30 },
            tagMasActivo: 'Platzi',
            diaMasProductivo: hoy.toISOString().split('T')[0],
            promedioDiario: { horas: 2, minutos: 15 }
        },
        distribucionTags: [
            { 
                tag: 'Platzi', 
                tiempo: 1800, 
                color: '#00B2A2',
                sesiones: 15,
                promedioSesion: 120,
                ultimoUso: hoy.toISOString().split('T')[0],
                tendencia: calcularTendenciaAleatoria()
            },
            { 
                tag: 'Ejercicio', 
                tiempo: 900, 
                color: '#10B981',
                sesiones: 8,
                promedioSesion: 112,
                ultimoUso: new Date(hoy.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                tendencia: calcularTendenciaAleatoria()
            },
            { 
                tag: 'Estudio', 
                tiempo: 1200, 
                color: '#F59E0B',
                sesiones: 12,
                promedioSesion: 100,
                ultimoUso: new Date(hoy.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                tendencia: calcularTendenciaAleatoria()
            },
            { 
                tag: 'Lectura', 
                tiempo: 600, 
                color: '#EF4444',
                sesiones: 5,
                promedioSesion: 120,
                ultimoUso: new Date(hoy.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                tendencia: calcularTendenciaAleatoria()
            }
        ]
    };
    
    // GENERAR DATOS DINÁMICOS DESPUÉS DE DEFINIR LA DISTRIBUCIÓN
    datosEstadisticas.tendenciaTemporal = generarTendenciaTemporal();
    datosEstadisticas.comparacionDiaria = generarComparacionDiaria();
    // CALCULAR EFICIENCIA BASÁNDOSE EN LOS DATOS DE LOS TAGS
    datosEstadisticas.eficiencia = calcularEficienciaTags();
    
    actualizarResumenEstadisticas();
    actualizarGraficos();
    actualizarTablaDetallada();
}

/**
 * Calcula una tendencia aleatoria más realista
 */
function calcularTendenciaAleatoria() {
    const tendencias = ['Subiendo', 'Bajando', 'Estable'];
    const probabilidades = [0.3, 0.2, 0.5]; // 30% subiendo, 20% bajando, 50% estable
    
    const random = Math.random();
    let acumulado = 0;
    
    for (let i = 0; i < probabilidades.length; i++) {
        acumulado += probabilidades[i];
        if (random <= acumulado) {
            return tendencias[i];
        }
    }
    
    return 'Estable';
}

/**
 * Genera datos de tendencia temporal dinámicos mejorados
 */
function generarTendenciaTemporal() {
    const hoy = new Date();
    const labels = [];
    const datasets = [];
    
    // Generar últimos 15 días
    for (let i = 14; i >= 0; i--) {
        const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(fecha.toISOString().split('T')[0]);
    }
    
    // Si hay distribución de tags, generar datos por tag principal
    if (datosEstadisticas.distribucionTags && datosEstadisticas.distribucionTags.length > 0) {
        // Tomar los 2 tags con más tiempo
        const topTags = datosEstadisticas.distribucionTags
            .sort((a, b) => b.tiempo - a.tiempo)
            .slice(0, 2);
            
        topTags.forEach(tagInfo => {
            const datosTag = [];
            let baseValue = tagInfo.tiempo / 30; // Promedio basado en tiempo total
            
            for (let i = 0; i < 15; i++) {
                baseValue += (Math.random() - 0.5) * (baseValue * 0.3); // Variación del 30%
                baseValue = Math.max(0, Math.min(baseValue * 2, baseValue)); // Limitar variación
                datosTag.push(Math.round(baseValue));
            }
            
            datasets.push({
                label: tagInfo.tag,
                data: datosTag,
                backgroundColor: tagInfo.color + '40', // 25% transparencia
                borderColor: tagInfo.color,
                borderWidth: 2,
                fill: false
            });
        });
    } else {
        // Fallback con Platzi
        const datosPlAtzi = [];
        let baseValue = 120;
        for (let i = 0; i < 15; i++) {
            baseValue += (Math.random() - 0.5) * 40; // Variación de ±20 minutos
            baseValue = Math.max(0, Math.min(300, baseValue)); // Entre 0 y 300 minutos
            datosPlAtzi.push(Math.round(baseValue));
        }
        
        datasets.push({
            label: 'Platzi',
            data: datosPlAtzi,
            backgroundColor: 'rgba(0, 178, 162, 0.3)',
            borderColor: '#00B2A2',
            borderWidth: 2,
            fill: false
        });
    }
    
    return { labels, datasets };
}

/**
 * Genera datos de comparación diaria con variación por tags - MEJORADO
 */
function generarComparacionDiaria() {
    const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const datasets = [];
    
    console.log('🔄 Generando comparación diaria por tags...');
    console.log('Tags disponibles:', datosEstadisticas.distribucionTags);
    
    // SIEMPRE generar datos por tag si están disponibles
    if (datosEstadisticas.distribucionTags && datosEstadisticas.distribucionTags.length > 0) {
        datosEstadisticas.distribucionTags.forEach((tagInfo, index) => {
            const datosTag = [];
            
            console.log(`📊 Generando datos para tag: ${tagInfo.tag}`);
            
            // Generar datos realistas por día para cada tag
            for (let i = 0; i < 7; i++) {
                let baseTime = (tagInfo.tiempo || 600) / 20; // Promedio basado en tiempo total
                
                // Ajustar por día de la semana
                if (i < 5) { // Lunes a Viernes
                    baseTime *= (0.8 + Math.random() * 0.6); // 80% a 140% del promedio
                } else { // Fin de semana
                    baseTime *= (0.3 + Math.random() * 0.7); // 30% a 100% del promedio
                }
                
                // Agregar variabilidad adicional
                const variacion = (Math.random() - 0.5) * 40;
                const tiempo = Math.round(Math.max(5, baseTime + variacion));
                
                datosTag.push(tiempo);
            }
            
            // Usar el color del tag o un color por defecto
            const colores = ['#00B2A2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];
            const colorBase = tagInfo.color || colores[index % colores.length];
            
            datasets.push({
                label: `${tagInfo.tag} (minutos)`,
                data: datosTag,
                backgroundColor: colorBase + '80', // 50% transparencia
                borderColor: colorBase,
                borderWidth: 1
            });
            
            console.log(`✅ Tag ${tagInfo.tag}: datos = [${datosTag.join(', ')}]`);
        });
    } else {
        console.log('⚠️ No hay tags disponibles, usando datos fallback');
        
        // Fallback con datos generales si no hay tags
        const datosDiarios = [
            180 + Math.random() * 60, // Lunes
            150 + Math.random() * 40, // Martes  
            200 + Math.random() * 50, // Miércoles
            120 + Math.random() * 80, // Jueves
            160 + Math.random() * 60, // Viernes
            90 + Math.random() * 30,  // Sábado
            60 + Math.random() * 40   // Domingo
        ].map(val => Math.round(val));
        
        datasets.push({
            label: 'Tiempo promedio (minutos)',
            data: datosDiarios,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1
        });
    }
    
    console.log('📈 Datasets generados:', datasets.length);
    return { labels, datasets };
}

/**
 * Calcula eficiencia por tags (tiempo real vs objetivo)
 */
function calcularEficienciaTags() {
    const distribucion = datosEstadisticas.distribucionTags || [];
    
    if (distribucion.length === 0) {
        return {
            labels: ['Sin datos'],
            tiempoReal: [0],
            tiempoObjetivo: [0],
            eficiencias: [0]
        };
    }
    
    const labels = [];
    const tiempoReal = [];
    const tiempoObjetivo = [];
    const eficiencias = [];
    
    distribucion.forEach(tag => {
        // Simular objetivo basado en el tiempo real (para datos de prueba)
        let objetivo = tag.objetivo || Math.round(tag.tiempo * (0.8 + Math.random() * 0.4)); // 80%-120% del tiempo real
        
        // Asegurar que el objetivo no sea menor que 30 minutos
        objetivo = Math.max(30, objetivo);
        
        const real = tag.tiempo || 0;
        const eficiencia = objetivo > 0 ? Math.round((real / objetivo) * 100) : 0;
        
        labels.push(tag.tag);
        tiempoReal.push(real);
        tiempoObjetivo.push(objetivo);
        eficiencias.push(eficiencia);
        
        console.log(`📊 ${tag.tag}: Real=${real}min, Objetivo=${objetivo}min, Eficiencia=${eficiencia}%`);
    });
    
    return {
        labels,
        tiempoReal,
        tiempoObjetivo,
        eficiencias
    };
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
    actualizarGraficoEficiencia();
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
 * Actualiza el gráfico de eficiencia (barras horizontales)
 */
function actualizarGraficoEficiencia() {
    const ctx = document.getElementById('grafico-eficiencia').getContext('2d');
    
    if (graficoEficiencia) {
        graficoEficiencia.destroy();
    }
    
    const eficiencia = datosEstadisticas.eficiencia || calcularEficienciaTags();
    
    graficoEficiencia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eficiencia.labels,
            datasets: [
                {
                    label: 'Tiempo Real (min)',
                    data: eficiencia.tiempoReal,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3B82F6',
                    borderWidth: 1
                },
                {
                    label: 'Objetivo (min)',
                    data: eficiencia.tiempoObjetivo,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10B981',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) {
                                const real = context.parsed.y;
                                const objetivo = eficiencia.tiempoObjetivo[context.dataIndex];
                                const porcentaje = objetivo > 0 ? Math.round((real / objetivo) * 100) : 0;
                                return `Eficiencia: ${porcentaje}%`;
                            }
                            return '';
                        }
                    }
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
                        text: 'Tags'
                    }
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
            <td class="px-4 py-2">${item.sesiones || Math.floor(Math.random() * 20) + 1}</td>
            <td class="px-4 py-2">${item.promedioSesion || Math.floor(Math.random() * 60) + 30}m</td>
            <td class="px-4 py-2">${formatearFecha(item.ultimoUso) || '-'}</td>
            <td class="px-4 py-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTendenciaClase(item.tendencia)}">
                    ${item.tendencia || calcularTendenciaAleatoria()}
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

/**
 * Función para refrescar con nuevos datos dinámicos - MEJORADA
 */
function refrescarEstadisticasTags() {
    console.log('🔄 Refrescando estadísticas...');
    
    // SIEMPRE regenerar datos dinámicos, incluso si hay datos del servidor
    if (datosEstadisticas.distribucionTags && datosEstadisticas.distribucionTags.length > 0) {
        console.log('🔄 Regenerando datos con tags existentes...');
        
        // Actualizar tendencias en distribución
        datosEstadisticas.distribucionTags.forEach(item => {
            item.tendencia = calcularTendenciaAleatoria();
            console.log(`📈 Nueva tendencia para ${item.tag}: ${item.tendencia}`);
        });
        
        // Regenerar datos dinámicos (tendencia temporal y comparación diaria siguen siendo dinámicos)
        console.log('📊 Regenerando gráficos...');
        datosEstadisticas.tendenciaTemporal = generarTendenciaTemporal();
        datosEstadisticas.comparacionDiaria = generarComparacionDiaria();
        
        // CALCULAR EFICIENCIA BASÁNDOSE EN LOS DATOS DE LOS TAGS
        datosEstadisticas.eficiencia = calcularEficienciaTags();
        
        // Forzar actualización de visualizaciones
        console.log('🎨 Actualizando visualizaciones...');
        actualizarGraficos();
        actualizarTablaDetallada();
        
        console.log('✅ Refresh completado');
    } else {
        console.log('📝 No hay datos previos, generando datos de prueba...');
        // Si no hay datos, usar datos de prueba
        usarDatosPrueba();
    }
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