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
