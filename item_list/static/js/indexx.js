document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('item-search-bar');
    const tableRows = document.querySelectorAll('#item-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const rowsPerPageSelector = document.getElementById('rows-per-page');

    // Search functionality
    searchBar.addEventListener('input', function () {
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
});
