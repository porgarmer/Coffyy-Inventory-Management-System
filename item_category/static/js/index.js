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

document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');

    // Hide any center messages if the popup is triggered
    const centerMessages = document.querySelectorAll('.messages');
    centerMessages.forEach(function (message) {
        message.style.display = 'none';
    });

    // If there's a hidden message, show the popup
    const popupTrigger = document.querySelector('div[style="display:none;"]');
    if (popupTrigger && popupTrigger.textContent.trim() !== '') {
        popupMessage.textContent = popupTrigger.textContent.trim();
        popup.classList.add('show');

        // Auto-close after 5 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('category-search-bar');
    const tableRows = document.querySelectorAll('#category-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');

    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.toLowerCase();
        let resultsFound = false;

        tableRows.forEach(row => {
            const categoryName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            if (categoryName.includes(searchTerm)) {
                row.style.display = ''; // Show row
                resultsFound = true;
            } else {
                row.style.display = 'none'; // Hide row
            }
        });

        if (resultsFound) {
            noResultsMessage.style.display = 'none'; // Hide "No results found" if results are found
        } else {
            noResultsMessage.style.display = 'block'; // Show "No results found" if no results match
        }
    });
});


