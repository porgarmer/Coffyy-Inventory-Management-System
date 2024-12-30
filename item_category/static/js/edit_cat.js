// Predefined color selection
const colorBoxes = document.querySelectorAll(".color-box");
const customColorInput = document.getElementById("custom-color");
const selectedColorInput = document.getElementById("selected-color");
const selectedColorBox = document.getElementById("selected-color-box");

document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const cancelButton = document.getElementById('cancel-button');

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

    const categoryNameInput = document.getElementById("category-name");
    const categoryForm = document.querySelector("form");
    const currentCategoryId = categoryForm.action.split("/").pop(); // Extract category ID from form action

    if (!categoryNameInput || !categoryForm) {
        console.error("Required DOM elements are missing!");
        return;
    }

    // Event listener for input field
    categoryNameInput.addEventListener("input", () => {
        const name = categoryNameInput.value.trim();
        validateCategoryNameEdit(name, currentCategoryId);
    });

    // Event listener for input field blur (focus lost)
    categoryNameInput.addEventListener("blur", () => {
        const name = categoryNameInput.value.trim();
        validateCategoryNameEdit(name, currentCategoryId);
    });

    // Handle Cancel Button Redirect with Popup Close
    cancelButton.addEventListener('click', function () {
        if (popup.classList.contains('show')) {
            popup.classList.remove('show');
        }
        // Redirect using the data attributes
        const page = cancelButton.getAttribute('data-page') || 1;
        const rows = cancelButton.getAttribute('data-rows') || 10;
        const redirectUrl = `/item-category/?page=${page}&rows=${rows}`;
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 0);
    });

    // Custom color selection
    colorBoxes.forEach(box => {
        box.addEventListener("click", () => {
            colorBoxes.forEach(box => box.classList.remove("selected"));
            box.classList.add("selected");
            const color = box.getAttribute("data-color");
            selectedColorInput.value = color;
            selectedColorBox.style.backgroundColor = color;
        });
    });

    customColorInput.addEventListener("input", () => {
        colorBoxes.forEach(box => box.classList.remove("selected"));
        const color = customColorInput.value;
        selectedColorInput.value = color;
        selectedColorBox.style.backgroundColor = color;
    });
});

// Function to validate category name edit
function validateCategoryNameEdit(categoryName, categoryId) {
    if (!categoryName) {
        return; // Skip if no name is entered
    }

    fetch(`/item-category/validate-category-name-edit/?name=${categoryName}&id=${categoryId}`)
        .then(response => response.json())
        .then(data => {
            const nameInput = document.getElementById('category-name');
            const errorText = document.getElementById('name-error-message');

            if (data.exists) {
                // If name exists, apply red underline style only
                nameInput.classList.add("is-invalid");

                // Show the error message below the input field
                if (errorText) {
                    errorText.textContent = "This category name is already taken.";
                    errorText.style.display = 'block';
                }
            } else {
                // If name is valid, remove the red underline
                nameInput.classList.remove("is-invalid");

                // Hide the error message
                if (errorText) {
                    errorText.textContent = '';
                    errorText.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error("Error validating category name:", error);
        });
}