document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('item-search-bar');
    const tableRows = document.querySelectorAll('#item-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const rowsPerPageSelector = document.getElementById('rows-per-page');
    const deleteButton = document.getElementById('delete-button');
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('#item-table-body input[type="checkbox"]');
    const deleteForm = document.getElementById('delete-form');
    const statusFilter = document.getElementById('status-filter');
    const supplierFilter = document.getElementById('supplier-filter');
    const deleteModalElement = document.getElementById('deleteModal');


    // Search functionality
    searchBar.addEventListener('submit', function () {
        const searchTerm = searchBar.value.toLowerCase().trim(); // Normalize input
        let resultsFound = false;

        tableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase().trim() || '';
            const categoryName = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase().trim() || '';

            if (itemName.includes(searchTerm) || categoryName.includes(searchTerm)) {
                row.style.display = ''; // Show matching rows
                resultsFound = true;
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });

        noResultsMessage.style.display = resultsFound ? 'none' : 'block';

        const url = new URL(window.location);
        url.searchParams.set('page', 1);
        window.history.pushState({}, '', url);
    });

    function updateUrlParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value); // Set the specified parameter
        url.searchParams.set('page', 1); // Reset to the first page
        window.history.pushState({}, '', url); // Update the browser URL
        location.reload(); // Reload the page
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            const selectedStatus = statusFilter.value; // Get selected category
            updateUrlParam('status', selectedStatus); // Update URL and reload
        });
    }

    if (supplierFilter) {
        supplierFilter.addEventListener('change', function () { 
            const selectedSupplier = supplierFilter.value;
            updateUrlParam('supplier', selectedSupplier)
         })
    }
    // Handle rows per page change
    if (rowsPerPageSelector) {
        rowsPerPageSelector.addEventListener('change', function () {
            const rowsPerPage = rowsPerPageSelector.value;
            const url = new URL(window.location);
            url.searchParams.set('rows', rowsPerPage);
            url.searchParams.set('page', 1);
            window.history.pushState({}, '', url);
            location.reload();
        });
    }

    // Update pagination links (Page numbers, Previous, Next)
    paginationLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default navigation
            const url = new URL(link.href);
            const currentSearch = searchBar.value.trim();
            const rowsPerPage = rowsPerPageSelector?.value;

            if (currentSearch) {
                url.searchParams.set('search', currentSearch);
            }
            if (rowsPerPage) {
                url.searchParams.set('rows', rowsPerPage);
            }

            window.location.href = url.toString();
        });
    });

    // Display popup messages if hidden success messages are present
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        const trimmedMessage = message.textContent.trim();
        if (trimmedMessage) {
            popupMessage.textContent = trimmedMessage;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Hide popup after 3 seconds
        }
    });

    // Toggle delete button visibility
    function toggleDeleteButton() {
        const anyChecked = Array.from(rowCheckboxes).some(checkbox => checkbox.checked);
        deleteButton.classList.toggle('d-none', !anyChecked);
    }

    // Handle row checkbox click
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleDeleteButton);
    });

    // Handle select all checkbox
    selectAllCheckbox.addEventListener('change', function () {
        const isChecked = selectAllCheckbox.checked;
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        toggleDeleteButton();
    });

    // Handle delete button click
    deleteButton.addEventListener('click', function () {
        const selectedIds = Array.from(rowCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
    
        if (selectedIds.length === 0) {
            alert("No items selected.");
            return;
        }
        // Show confirmation modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        const deleteCount = document.getElementById('delete-count');
        deleteCount.textContent = selectedIds.length;
        deleteModal.show();
        // Confirm deletion in modal
        document.getElementById('confirm-delete').addEventListener('click', function () {
            // Form submission method
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = deleteForm.action;
    
            // Add CSRF token
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = document.querySelector('[name=csrfmiddlewaretoken]').value;
            form.appendChild(csrfInput);
    
            // Add selected IDs
            selectedIds.forEach(id => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_ids';
                input.value = id;
                form.appendChild(input);
            });
    
            // Append form to body and submit
            document.body.appendChild(form);
            form.submit();
    
            // // Show popup message
            // popupMessage.textContent = "Purchase order/s deleted successfully!";
            // popup.classList.add('show');
            // setTimeout(() => popup.classList.remove('show'), 30000);
        });
    });    
    deleteModalElement.addEventListener('hidden.bs.modal', function () {
        // Manually remove any remaining backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    });
});