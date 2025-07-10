// Function to load all available tags
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

// Function to render tags in the container
function renderTagsInContainer(tags) {
    const container = document.getElementById('tags-container');
    container.innerHTML = '';

    tags.forEach(tag => {
        const tagElement = createTagElement(tag);
        container.appendChild(tagElement);
    });
}

// Function to create a tag element
function createTagElement(tag) {
    const label = document.createElement('label');
    label.className = 'relative cursor-pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = tag.id;
    input.className = 'tag-checkbox peer sr-only';
    input.dataset.tagId = tag.id;

    const span = document.createElement('span');
    span.className = 'px-3 py-1 rounded-full border-2 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white transition-colors';
    span.style.backgroundColor = tag.color;
    span.style.borderColor = tag.color;
    span.textContent = tag.nombre;

    label.appendChild(input);
    label.appendChild(span);

    return label;
}

// Function to update selected tags
function updateSelectedTags() {
    const selectedTags = Array.from(document.querySelectorAll('.tag-checkbox:checked'))
        .map(checkbox => checkbox.dataset.tagId);
    document.getElementById('selected_tags').value = selectedTags.join(',');
}

// Function to set selected tags when editing a habit
function setSelectedTags(tagIds) {
    document.querySelectorAll('.tag-checkbox').forEach(checkbox => {
        checkbox.checked = tagIds.includes(parseInt(checkbox.dataset.tagId));
    });
    updateSelectedTags();
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTags();
    
    // Add change event listener to tag container for checkbox changes
    document.getElementById('tags-container').addEventListener('change', (e) => {
        if (e.target.classList.contains('tag-checkbox')) {
            updateSelectedTags();
        }
    });
}); 