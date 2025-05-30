// Variables globales
let selectedTagIds = [];

// Funciones de UI
function mostrarVentanaGestionTags() {
    document.getElementById('ventanaGestionTags').style.display = 'block';
    document.getElementById('ventana2').style.display = 'none';
    loadTags();
}

function cerrarVentanaGestionTags() {
    document.getElementById('ventanaGestionTags').style.display = 'none';
    document.getElementById('ventana2').style.display = 'block';
}

function mostrarFormularioTag() {
    document.getElementById('form-tag').style.display = 'block';
    document.getElementById('tag_id').value = '';
    document.getElementById('tag_nombre').value = '';
    document.getElementById('tag_descripcion').value = '';
    document.getElementById('tag_color').value = '#CCCCCC';
    document.getElementById('titulo-form-tag').textContent = 'Crear nuevo tag';
}

function cancelarFormularioTag() {
    document.getElementById('form-tag').style.display = 'none';
}

// Funciones de gestión de tags
function loadTags() {
    fetch('/habitos/tags/')
        .then(response => response.json())
        .then(data => {
            if (data.tags) {
                renderTagsInContainer(data.tags);
            }
        })
        .catch(error => console.error('Error loading tags:', error));
}

function renderTagsInContainer(tags) {
    const container = document.getElementById('tags-container');
    container.innerHTML = '';

    tags.forEach(tag => {
        const tagElement = createTagElement(tag);
        container.appendChild(tagElement);
    });
    
    // Marcar los tags que ya estaban seleccionados
    updateTagCheckboxes();
}

function createTagElement(tag) {
    const div = document.createElement('div');
    div.className = 'tag-item flex items-center gap-2 p-2 border rounded';
    div.style.backgroundColor = tag.color;
    div.style.color = getContrastColor(tag.color);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tag-checkbox';
    checkbox.value = tag.id;
    checkbox.checked = selectedTagIds.includes(tag.id);
    checkbox.addEventListener('change', () => toggleTagSelection(tag.id));

    const label = document.createElement('span');
    label.textContent = tag.nombre;

    const editButton = document.createElement('button');
    editButton.className = 'material-icons text-sm';
    editButton.textContent = 'edit';
    editButton.onclick = () => editarTag(tag);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'material-icons text-sm';
    deleteButton.textContent = 'delete';
    deleteButton.onclick = () => eliminarTag(tag.id);

    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    return div;
}

function toggleTagSelection(tagId) {
    tagId = parseInt(tagId);
    const index = selectedTagIds.indexOf(tagId);
    if (index === -1) {
        selectedTagIds.push(tagId);
    } else {
        selectedTagIds.splice(index, 1);
    }
    updateSelectedTagsDisplay();
    document.getElementById('tags_seleccionados').value = JSON.stringify(selectedTagIds);
}

function updateTagCheckboxes() {
    document.querySelectorAll('.tag-checkbox').forEach(checkbox => {
        checkbox.checked = selectedTagIds.includes(parseInt(checkbox.value));
    });
}

function updateSelectedTagsDisplay() {
    const container = document.getElementById('selected-tags');
    container.innerHTML = '';
    
    fetch('/habitos/tags/')
        .then(response => response.json())
        .then(data => {
            const selectedTags = data.tags.filter(tag => selectedTagIds.includes(tag.id));
            selectedTags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'px-2 py-1 rounded-full text-sm';
                span.style.backgroundColor = tag.color;
                span.style.color = getContrastColor(tag.color);
                span.textContent = tag.nombre;
                container.appendChild(span);
            });
        });
}

function guardarTag() {
    const tagData = {
        nombre: document.getElementById('tag_nombre').value,
        descripcion: document.getElementById('tag_descripcion').value,
        color: document.getElementById('tag_color').value
    };

    const tagId = document.getElementById('tag_id').value;
    const url = tagId ? `/habitos/tags/editar/${tagId}/` : '/habitos/tags/crear/';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(tagData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadTags();
            cancelarFormularioTag();
        }
    })
    .catch(error => console.error('Error:', error));
}

function editarTag(tag) {
    document.getElementById('form-tag').style.display = 'block';
    document.getElementById('tag_id').value = tag.id;
    document.getElementById('tag_nombre').value = tag.nombre;
    document.getElementById('tag_descripcion').value = tag.descripcion || '';
    document.getElementById('tag_color').value = tag.color;
    document.getElementById('titulo-form-tag').textContent = 'Editar tag';
}

function eliminarTag(tagId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este tag?')) return;

    fetch(`/habitos/tags/eliminar/${tagId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Remover el tag de la selección si estaba seleccionado
            const index = selectedTagIds.indexOf(tagId);
            if (index !== -1) {
                selectedTagIds.splice(index, 1);
                updateSelectedTagsDisplay();
            }
            loadTags();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para obtener color de contraste
function getContrastColor(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

// Función para establecer tags seleccionados
function setSelectedTags(tagIds) {
    if (!tagIds) return;
    
    if (typeof tagIds === 'string') {
        try {
            tagIds = JSON.parse(tagIds);
        } catch (e) {
            console.error('Error parsing tag IDs:', e);
            return;
        }
    }
    
    if (!Array.isArray(tagIds)) {
        console.error('Tag IDs must be an array');
        return;
    }

    selectedTagIds = tagIds.map(id => parseInt(id));
    updateSelectedTagsDisplay();
    updateTagCheckboxes();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tags iniciales si es necesario
    updateSelectedTagsDisplay();
}); 