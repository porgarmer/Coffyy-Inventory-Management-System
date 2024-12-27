document.addEventListener("DOMContentLoaded", () => {
    const soldByEach = document.getElementById("sold-by-each");
    const soldByVolumeWeight = document.getElementById("sold-by-volume-weight");
    const volumeWeightGroup = document.getElementById("volume-weight-group");

    // Initial setup: Show/Hide the Volume/Weight group based on the selected option
    const toggleVolumeWeightGroup = () => {
        if (soldByVolumeWeight.checked) {
            volumeWeightGroup.style.display = "block";
        } else {
            volumeWeightGroup.style.display = "none";
        }
    };

    // Add event listeners to radio buttons
    soldByEach.addEventListener("change", toggleVolumeWeightGroup);
    soldByVolumeWeight.addEventListener("change", toggleVolumeWeightGroup);

    // Call the function initially to set the correct visibility
    toggleVolumeWeightGroup();
});
