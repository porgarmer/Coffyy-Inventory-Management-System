document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('item-search-bar');
    const tableRows = document.querySelectorAll('#item-table-body tr');
    const noResultsMessage = document.getElementById('no-results-message');

    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.toLowerCase();
        let resultsFound = false;

        tableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const categoryName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
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
    });
});
