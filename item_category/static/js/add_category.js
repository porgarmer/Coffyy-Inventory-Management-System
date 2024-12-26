document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const cancelButton = document.getElementById('cancel-button');

    const colorBoxes = document.querySelectorAll(".color-box");
    const customColorInput = document.getElementById("custom-color");
    const selectedColorInput = document.getElementById("selected-color");
    const selectedColorBox = document.getElementById("selected-color-box");

    // Hide any center messages if the popup is triggered
    const centerMessages = document.querySelectorAll('.messages');
    centerMessages.forEach(function (message) {
        message.style.display = 'none';
    });

    // If there's a hidden message, show the popup
    const popupTrigger = document.querySelector('div[style="display:none;"]');
    if (popupTrigger && popupTrigger.textContent.trim() !== '') {
        popupMessage.textContent = popupTrigger.textContent;
        popup.classList.add('show');

        // Auto-close after 5 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 5000);
    }

    // Handle Cancel Button Redirect with Popup Close
    cancelButton.addEventListener('click', function () {
        // Redirect using the data attributes
        const page = cancelButton.getAttribute('data-page') || 1;
        const rows = cancelButton.getAttribute('data-rows') || 10;
        const redirectUrl = `/item-category/?page=${page}&rows=${rows}`;
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 500);
    });

    // Predefined color selection
    colorBoxes.forEach(box => {
        box.addEventListener("click", () => {
            colorBoxes.forEach(box => box.classList.remove("selected"));
            box.classList.add("selected");
            const color = box.getAttribute("data-color");
            selectedColorInput.value = color;
            selectedColorBox.style.backgroundColor = color;
        });
    });

    // Custom color selection
    customColorInput.addEventListener("input", () => {
        colorBoxes.forEach(box => box.classList.remove("selected"));
        const color = customColorInput.value;
        selectedColorInput.value = color;
        selectedColorBox.style.backgroundColor = color;
    });
});
