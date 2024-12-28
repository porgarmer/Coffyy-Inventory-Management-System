document.addEventListener("DOMContentLoaded", () => {
    // Sold By Logic
    const soldByEach = document.getElementById("sold-by-each");
    const soldByVolumeWeight = document.getElementById("sold-by-volume-weight");
    const volumeWeightGroup = document.getElementById("volume-weight-group");
    const remainingVolumeGroup = document.getElementById("remaining-volume-group");

    // Composite Item Logic
    const compositeItemCheckbox = document.getElementById("composite-item");
    const compositeItemTable = document.getElementById("composite-item-table");

    // Remaining Volume Field
    const inStockInput = document.getElementById("in-stock"); // "In Stock" input
    const volumeWeightInput = document.getElementById("volume-weight-per-unit"); // Volume/Weight per Unit input
    const remainingVolumeOutput = document.getElementById("remaining-volume"); // Remaining Volume (output)

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

    // Function to calculate Remaining Volume dynamically
    const calculateRemainingVolume = () => {
        if (inStockInput && volumeWeightInput && remainingVolumeOutput) {
            const inStock = parseFloat(inStockInput.value) || 0; // Get "In Stock" value or 0
            const volumeWeight = parseFloat(volumeWeightInput.value) || 0; // Get Volume/Weight value or 0
            const remainingVolume = Math.max(inStock * volumeWeight, 0); // Ensure no negative values
            remainingVolumeOutput.value = remainingVolume.toFixed(2); // Update the output field
            console.log(
                `Calculated Remaining Volume: ${remainingVolume} (In Stock: ${inStock}, Volume/Weight: ${volumeWeight})`
            ); // Debug log
        }
    };

    // Add input listeners to trigger dynamic calculation
    inStockInput.addEventListener("input", calculateRemainingVolume);
    volumeWeightInput.addEventListener("input", calculateRemainingVolume);

    // Add event listeners for Sold By radio buttons
    soldByEach.addEventListener("change", toggleVolumeWeightGroup);
    soldByVolumeWeight.addEventListener("change", toggleVolumeWeightGroup);

    // Add event listener for Composite Item checkbox
    compositeItemCheckbox.addEventListener("change", toggleCompositeItemTable);

    // Initial visibility setup
    toggleVolumeWeightGroup();
    toggleCompositeItemTable();

    // Monetary Fields Logic
    const monetaryFields = document.querySelectorAll(".form-group .input-group input");

    // Ensure monetary fields have valid input
    monetaryFields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.value < 0) field.value = 0; // Prevent negative values
        });
    });

    // Cancel Button Logic
    document.getElementById("cancel-button").addEventListener("click", function () {
        const page = this.getAttribute('data-page') || 1; // Default to 1 if not found
        const rows = this.getAttribute('data-rows') || 10; // Default to 10 if not found

        const redirectUrl = `/item-list/?page=${page}&rows=${rows}`;

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 0);
    });

    // Popup Message Logic
    const popup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    const messages = document.querySelectorAll(".messages p");
    if (messages.length > 0) {
        popupMessage.textContent = messages[0].textContent; // Display the first message
        popup.style.display = "block";

        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }
});
