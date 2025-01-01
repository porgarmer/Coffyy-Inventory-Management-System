document.addEventListener('DOMContentLoaded', function () {
    // Select/Unselect all checkboxes
    document.getElementById('select-all').addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            checkbox.disabled = this.checked; // Disable checkboxes when 'Select All' is checked
        });
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
    document.getElementById('delete-form').addEventListener('submit', function (e) {
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

        document.getElementById('confirm-delete').addEventListener('click', function () {
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
        pageInput.value = 1; // Reset to first page
        rowsForm.submit();
    });

    // Ensure rows-per-page dropdown retains its selected value
    const rowsPerPage = document.getElementById('rows-per-page');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('rows')) {
        rowsPerPage.value = urlParams.get('rows');
    }

    // Update pagination links to retain rows and search parameters
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    paginationLinks.forEach(link => {
        const url = new URL(link.href, window.location.origin);
        if (urlParams.has('rows')) {
            url.searchParams.set('rows', urlParams.get('rows'));
        }
        if (urlParams.has('search')) {
            url.searchParams.set('search', urlParams.get('search'));
        }
        link.href = url.toString();
    });

    // Popup message handling
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');

    const popupTrigger = document.querySelector('div[style="display:none;"]');
    if (popupTrigger && popupTrigger.textContent.trim() !== '') {
        popupMessage.textContent = popupTrigger.textContent.trim();
        popup.classList.add('show');

        // Auto-close after 5 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    // Search form handling
    const searchForm = document.getElementById('search-form');
    const searchBar = document.getElementById('category-search-bar');

    searchBar.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchForm.submit();
        }
    });

    searchForm.addEventListener('submit', function (event) {
        const searchTerm = searchBar.value.trim();
        if (!searchTerm) {
            event.preventDefault();
            alert('Please enter a search term.');
        } else {
            // Add the rows parameter dynamically to the search form
            const rowsInput = document.createElement('input');
            rowsInput.type = 'hidden';
            rowsInput.name = 'rows';
            rowsInput.value = rowsPerPage.value;
            searchForm.appendChild(rowsInput);
        }
    });
});
