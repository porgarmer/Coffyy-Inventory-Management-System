document.addEventListener("DOMContentLoaded", () => {
    // Sold By Logic
    const soldByEach = document.getElementById("sold-by-each");
    const soldByVolumeWeight = document.getElementById("sold-by-volume-weight");
    const volumeWeightGroup = document.getElementById("volume-weight-group");
    const remainingVolumeGroup = document.getElementById("remaining-volume-group");

    // Composite Item Logic
    const compositeItemCheckbox = document.getElementById("composite-item");
    const compositeItemTable = document.getElementById("composite-item-table");

    // Function to toggle visibility for Volume/Weight groups
    const toggleVolumeWeightGroup = () => {
        console.log("Toggling visibility based on 'Sold By' selection..."); // Debug log
        if (soldByVolumeWeight.checked) {
            volumeWeightGroup.style.display = "block";
            remainingVolumeGroup.style.display = "block";
            console.log("Volume/Weight selected - both groups visible."); // Debug log
        } else {
            volumeWeightGroup.style.display = "none";
            remainingVolumeGroup.style.display = "none";
            console.log("Each selected - both groups hidden."); // Debug log
        }
    };

    // Function to toggle visibility for Composite Item Table
    const toggleCompositeItemTable = () => {
        console.log("Toggling visibility for Composite Item Table..."); // Debug log
        if (compositeItemCheckbox.checked) {
            compositeItemTable.style.display = "block";
            console.log("Composite Item checked - table visible."); // Debug log
        } else {
            compositeItemTable.style.display = "none";
            console.log("Composite Item unchecked - table hidden."); // Debug log
        }
    };

    // Check if all elements for Sold By exist
    if (!soldByEach || !soldByVolumeWeight || !volumeWeightGroup || !remainingVolumeGroup) {
        console.error("One or more elements not found for 'Sold By':", {
            soldByEach,
            soldByVolumeWeight,
            volumeWeightGroup,
            remainingVolumeGroup,
        });
        return;
    }

    // Check if all elements for Composite Item exist
    if (!compositeItemCheckbox || !compositeItemTable) {
        console.error("Composite item checkbox or table not found:", {
            compositeItemCheckbox,
            compositeItemTable,
        });
        return;
    }

    // Add event listeners for 'Sold By' radio buttons
    soldByEach.addEventListener("change", toggleVolumeWeightGroup);
    soldByVolumeWeight.addEventListener("change", toggleVolumeWeightGroup);

    // Add event listener for Composite Item checkbox
    compositeItemCheckbox.addEventListener("change", toggleCompositeItemTable);

    // Initial visibility setup
    toggleVolumeWeightGroup();
    toggleCompositeItemTable();
});

document.addEventListener("DOMContentLoaded", () => {
    // Select all input fields with a Peso prefix
    const monetaryFields = document.querySelectorAll(".form-group .input-group input");

    // Ensure monetary fields have valid input
    monetaryFields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.value < 0) field.value = 0; // Prevent negative values
        });
    });
});

document.getElementById("cancel-button").addEventListener("click", function () {
    // Retrieve the values of data-page and data-rows attributes, falling back to defaults if missing
    const page = this.getAttribute('data-page') || 1;  // Default to 1 if not found
    const rows = this.getAttribute('data-rows') || 10;  // Default to 10 if not found

    // Construct the redirect URL using these values
    const redirectUrl = `/item-list/?page=${page}&rows=${rows}`;
    
    // Redirect with a slight delay (to match item_category behavior)
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 0);  // Delay of 500ms (adjust as necessary)
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    // Check if there are messages passed from the backend
    const messages = document.querySelectorAll(".messages p");
    if (messages.length > 0) {
        popupMessage.textContent = messages[0].textContent; // Display the first message
        popup.style.display = "block";

        // Automatically hide the popup after 3 seconds
        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }
});