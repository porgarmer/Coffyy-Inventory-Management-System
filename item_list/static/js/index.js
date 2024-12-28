document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('item-search-bar');
    const tableRows = document.querySelectorAll('#item-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const rowsPerPageSelector = document.getElementById('rows-per-page');

    // Search functionality
    searchBar.addEventListener('input', function (event) {
        const searchTerm = searchBar.value.toLowerCase();
        let resultsFound = false;

        tableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const categoryName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            if (itemName.includes(searchTerm) || categoryName.includes(searchTerm)) {
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

        // Reset page number to 1 when a new search is made
        const url = new URL(window.location);
        url.searchParams.set('page', 1);
        window.history.pushState({}, '', url); // Update the URL with the new page number
    });

    // Handle rows per page change
    rowsPerPageSelector.addEventListener('change', function () {
        const rowsPerPage = rowsPerPageSelector.value;
        const url = new URL(window.location);
        url.searchParams.set('rows', rowsPerPage);
        url.searchParams.set('page', 1);  // Reset to the first page when rows per page is changed
        window.history.pushState({}, '', url); // Update the URL
        location.reload(); // Reload the page to reflect the new rows per page
    });

    // Ensure the page number and rows per page are passed correctly when clicking a pagination link
    paginationLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const currentPage = new URL(link.href).searchParams.get('page');
            const rowsPerPage = new URL(link.href).searchParams.get('rows');
            const url = new URL(window.location);
            url.searchParams.set('page', currentPage); // Get current page from the link
            url.searchParams.set('rows', rowsPerPage); // Get rows from the link
            window.history.pushState({}, '', url); // Update the URL
        });
    });

    // Show popup if a success message is present
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        if (message.textContent.trim()) {
            popupMessage.textContent = message.textContent.trim();
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Hide popup after 3 seconds
        }
    });
});
