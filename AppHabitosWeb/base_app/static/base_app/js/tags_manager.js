// Variables globales
let allTags = []; // Todos los tags disponibles
let selectedTagIds = []; // IDs de tags seleccionados para el hábito actual

/**
 * Función para establecer los tags seleccionados (usada al editar un hábito)
 * @param {Array} tagIds - Array de IDs de tags a seleccionar
 */
function setSelectedTags(tagIds) {
    selectedTagIds = [...tagIds]; // Clonar el array
    document.getElementById('tags_seleccionados').value = JSON.stringify(selectedTagIds);
    
    // Si ya tenemos los tags cargados, actualizar la visualización
    if (allTags.length > 0) {
        actualizarTagsVisuales();
    } else {
        // Si no están cargados, cargarlos y luego actualizar
        cargarTags().then(() => {
            actualizarTagsVisuales();
        });
    }
}

/**
 * Función para limpiar los tags seleccionados (usada al crear un nuevo hábito)
 */
function limpiarTagsSeleccionados() {
    selectedTagIds = [];
    document.getElementById('tags_seleccionados').value = '[]';
    actualizarTagsVisuales();
}

/**
 * Mostrar la ventana de gestión de tags
 */
function mostrarVentanaGestionTags() {
    // Guardar los tags seleccionados actualmente
    selectedTagIds = JSON.parse(document.getElementById('tags_seleccionados').value || '[]');
    
    // Mostrar la ventana de gestión de tags
    cambiarVentana('ventana4');
    
    // Cargar los tags desde el servidor
    cargarTags();
}

// Cargar los tags desde el servidor
function cargarTags() {
    return fetch('/habitos/tags/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.tags) {
            allTags = data.tags;
            renderizarTags();
            renderizarTagsParaSeleccion();
        }
        return data;
    })
    .catch(error => {
        console.error('Error al cargar tags:', error);
        throw error;
    });
}

// Renderizar los tags en la lista
function renderizarTags() {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = '';
    
    if (allTags.length === 0) {
        tagsContainer.innerHTML = '<p>No hay tags disponibles. Crea tu primer tag.</p>';
        return;
    }
    
    allTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item p-2 rounded flex items-center gap-2 mb-2';
        tagElement.style.backgroundColor = tag.color;
        tagElement.style.color = getContrastColor(tag.color);
        
        tagElement.innerHTML = `
            <span>${tag.nombre}</span>
            <div class="tag-actions ml-2">
                <button onclick="editarTag(${tag.id})" class="px-1 py-0.5 text-xs bg-white text-gray-800 rounded">Editar</button>
                <button onclick="eliminarTag(${tag.id})" class="px-1 py-0.5 text-xs bg-white text-gray-800 rounded ml-1">Eliminar</button>
            </div>
        `;
        
        tagsContainer.appendChild(tagElement);
    });
}

// Renderizar los tags para selección
function renderizarTagsParaSeleccion() {
    const seleccionContainer = document.getElementById('tags-seleccion-container');
    seleccionContainer.innerHTML = '';
    
    if (allTags.length === 0) {
        seleccionContainer.innerHTML = '<p>No hay tags disponibles. Crea tu primer tag.</p>';
        return;
    }
    
    allTags.forEach(tag => {
        const isSelected = selectedTagIds.includes(tag.id);
        
        const tagElement = document.createElement('div');
        tagElement.className = `tag-select-item p-2 rounded flex items-center gap-2 mb-2 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`;
        tagElement.style.backgroundColor = tag.color;
        tagElement.style.color = getContrastColor(tag.color);
        tagElement.setAttribute('data-tag-id', tag.id);
        
        tagElement.innerHTML = `<span>${tag.nombre}</span>`;
        
        tagElement.addEventListener('click', () => toggleTagSelection(tag.id, tagElement));
        
        seleccionContainer.appendChild(tagElement);
    });
}

// Alternar la selección de un tag
function toggleTagSelection(tagId, element) {
    const index = selectedTagIds.indexOf(tagId);
    
    if (index === -1) {
        // Seleccionar el tag
        selectedTagIds.push(tagId);
        element.classList.add('ring-2', 'ring-blue-500');
    } else {
        // Deseleccionar el tag
        selectedTagIds.splice(index, 1);
        element.classList.remove('ring-2', 'ring-blue-500');
    }
}

// Aplicar los tags seleccionados al hábito
function aplicarTagsSeleccionados() {
    document.getElementById('tags_seleccionados').value = JSON.stringify(selectedTagIds);
    actualizarTagsVisuales();
    cambiarVentana('ventana2');
}

// Actualizar la visualización de tags en el formulario de hábito
function actualizarTagsVisuales() {
    const container = document.getElementById('selected-tags');
    container.innerHTML = '';
    
    const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag.id));
    
    selectedTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-badge px-2 py-1 rounded text-sm';
        tagElement.style.backgroundColor = tag.color;
        tagElement.style.color = getContrastColor(tag.color);
        tagElement.textContent = tag.nombre;
        
        container.appendChild(tagElement);
    });
    
    if (selectedTags.length === 0) {
        container.innerHTML = '<span class="text-gray-500">No hay tags seleccionados</span>';
    }
}

// Mostrar el formulario para crear/editar un tag
function mostrarFormularioTag(tagId = null) {
    const formTag = document.getElementById('form-tag');
    const tituloForm = document.getElementById('titulo-form-tag');
    
    // Limpiar el formulario
    document.getElementById('tag_id').value = '';
    document.getElementById('tag_nombre').value = '';
    document.getElementById('tag_descripcion').value = '';
    document.getElementById('tag_color').value = '#CCCCCC';
    
    if (tagId) {
        // Modo edición
        const tag = allTags.find(t => t.id === tagId);
        if (tag) {
            tituloForm.textContent = 'Editar tag';
            document.getElementById('tag_id').value = tag.id;
            document.getElementById('tag_nombre').value = tag.nombre;
            document.getElementById('tag_descripcion').value = tag.descripcion || '';
            document.getElementById('tag_color').value = tag.color;
        }
    } else {
        // Modo creación
        tituloForm.textContent = 'Crear nuevo tag';
    }
    
    formTag.style.display = 'block';
    inicializarPaletaColores();
}

// Cancelar el formulario de tag
function cancelarFormularioTag() {
    document.getElementById('form-tag').style.display = 'none';
}

// Inicializar la paleta de colores para tags
function inicializarPaletaColores() {
    const colorPalette = document.getElementById('tag_colorPalette');
    colorPalette.innerHTML = '';
    
    const colors = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', 
        '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40', '#CCCCCC', '#9E9E9E'
    ];
    
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color';
        colorDiv.style.width = '24px';
        colorDiv.style.height = '24px';
        colorDiv.style.display = 'inline-block';
        colorDiv.style.margin = '2px';
        colorDiv.style.cursor = 'pointer';
        colorDiv.style.backgroundColor = color;
        
        colorDiv.addEventListener('click', function() {
            document.getElementById('tag_color').value = color;
            
            // Resetear todos los bordes
            Array.from(colorPalette.children).forEach(div => {
                div.style.border = 'none';
            });
            
            // Marcar el color seleccionado
            colorDiv.style.border = '2px solid black';
        });
        
        colorPalette.appendChild(colorDiv);
    });
}

// Obtener un color de contraste para texto (blanco o negro)
function getContrastColor(hexColor) {
    // Si no hay color, o es un color claro por defecto, usar texto negro
    if (!hexColor || hexColor === '#CCCCCC') return '#000000';
    
    // Convertir hexColor a RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calcular luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Si la luminosidad es alta (color claro), usar texto negro, de lo contrario blanco
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Guardar un nuevo tag o actualizar uno existente
function guardarTag() {
    const tagId = document.getElementById('tag_id').value;
    const nombre = document.getElementById('tag_nombre').value;
    const descripcion = document.getElementById('tag_descripcion').value;
    const color = document.getElementById('tag_color').value;
    
    if (!nombre) {
        alert('El nombre del tag es obligatorio');
        return;
    }
    
    const data = {
        nombre: nombre,
        descripcion: descripcion,
        color: color
    };
    
    let url, method;
    
    if (tagId) {
        // Actualizar tag existente
        url = `/habitos/tags/editar/${tagId}/`;
        method = 'POST';
    } else {
        // Crear nuevo tag
        url = '/habitos/tags/crear/';
        method = 'POST';
    }
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            cancelarFormularioTag();
            cargarTags(); // Recargar la lista de tags
        } else {
            alert('Error al guardar el tag: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el tag');
    });
}

// Editar un tag existente
function editarTag(tagId) {
    mostrarFormularioTag(tagId);
}

// Eliminar un tag
function eliminarTag(tagId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este tag? Esta acción no se puede deshacer.')) {
        return;
    }
    
    fetch(`/habitos/tags/eliminar/${tagId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Eliminar el tag de la lista de seleccionados si estaba seleccionado
            const index = selectedTagIds.indexOf(tagId);
            if (index !== -1) {
                selectedTagIds.splice(index, 1);
                document.getElementById('tags_seleccionados').value = JSON.stringify(selectedTagIds);
            }
            
            cargarTags(); // Recargar la lista de tags
        } else {
            alert('Error al eliminar el tag: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el tag');
    });
}

// Cerrar la ventana de gestión de tags
function cerrarVentanaGestionTags() {
    cambiarVentana('ventana2');
}

// Cargar tags al iniciar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Solo cargar los tags si el usuario está autenticado
    if (!document.getElementById('miLista')) return;
    
    // Cargar los tags para tenerlos disponibles
    cargarTags();
}); 