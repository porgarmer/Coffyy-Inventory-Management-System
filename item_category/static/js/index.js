// Select/Unselect all checkboxes
document.getElementById('select-all').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    toggleDeleteButton();
});

// Toggle delete button visibility based on selection
const checkboxes = document.querySelectorAll('.item-checkbox');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', toggleDeleteButton);
});

function toggleDeleteButton() {
    const deleteButton = document.getElementById('delete-button');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    deleteButton.classList.toggle('d-none', !anyChecked);
}

// Handle delete form submission with modal confirmation
document.getElementById('delete-form').addEventListener('submit', function(e) {
    const selectedCategories = document.querySelectorAll('.item-checkbox:checked');
    if (selectedCategories.length === 0) {
        e.preventDefault();
        alert("Please select categories to delete.");
        return;
    }

    const deleteCount = selectedCategories.length;
    document.getElementById('delete-count').innerText = deleteCount;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
    e.preventDefault();

    document.getElementById('confirm-delete').addEventListener('click', function() {
        const selectedContainer = document.getElementById('selected-categories-container');
        selectedContainer.innerHTML = '';
        selectedCategories.forEach(checkbox => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selected_categories';
            input.value = checkbox.value;
            selectedContainer.appendChild(input);
        });

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        document.getElementById('delete-form').submit();
    });
});

// Submit rows-per-page form on change
document.getElementById('rows-per-page').addEventListener('change', function () {
    const rowsForm = document.getElementById('rows-per-page-form');
    const pageInput = rowsForm.querySelector('input[name="page"]');
    pageInput.value = 1;
    rowsForm.submit();
});
