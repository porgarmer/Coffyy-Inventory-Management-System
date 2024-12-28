document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('category-search-bar');
    const tableRows = document.querySelectorAll('#category-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const rowsPerPageSelector = document.getElementById('rows-per-page');

    // Search functionality
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        let resultsFound = false;

        // Filter table rows based on search input
        tableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const categoryName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            if (itemName.includes(searchTerm) || categoryName.includes(searchTerm)) {
                row.style.display = ''; // Show row if it matches search
                resultsFound = true;
            } else {
                row.style.display = 'none'; // Hide row if no match
            }
        });

        // Toggle "No results found" message
        noResultsMessage.style.display = resultsFound ? 'none' : 'block';

        // Reset pagination to the first page after new search input
        const url = new URL(window.location);
        url.searchParams.set('page', 1);
        window.history.pushState({}, '', url); // Update the URL with the new page number
    });

    // Handle rows per page change
    rowsPerPageSelector.addEventListener('change', function () {
        const rowsPerPage = rowsPerPageSelector.value;
        const url = new URL(window.location);
        url.searchParams.set('rows', rowsPerPage); // Set rows per page parameter
        url.searchParams.set('page', 1); // Reset pagination to the first page
        window.history.pushState({}, '', url); // Update the URL
        location.reload(); // Reload the page to apply changes
    });

    // Update URL for pagination clicks
    paginationLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link navigation
            const currentPage = new URL(link.href).searchParams.get('page');
            const rowsPerPage = new URL(window.location).searchParams.get('rows') || rowsPerPageSelector.value;
            const url = new URL(window.location);
            url.searchParams.set('page', currentPage);
            url.searchParams.set('rows', rowsPerPage);
            window.history.pushState({}, '', url); // Update URL
            location.reload(); // Reload page with updated parameters
        });
    });

    // Show popup for success messages
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        if (message.textContent.trim()) {
            popupMessage.textContent = message.textContent.trim();
            popup.classList.add('show');

            // Hide popup automatically after 3 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }
    });
});
