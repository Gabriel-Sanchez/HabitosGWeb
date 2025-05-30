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