document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');
    const cancelButton = document.getElementById('cancel-button');

    const colorBoxes = document.querySelectorAll(".color-box");
    const customColorInput = document.getElementById("custom-color");
    const selectedColorInput = document.getElementById("selected-color");
    const selectedColorBox = document.getElementById("selected-color-box");

    const categoryNameInput = document.getElementById("category-name");
    const categoryNameErrorLabel = document.getElementById("category-name-error");
    const categoryId = categoryNameInput.dataset.categoryId; // Assume category ID is stored as a data attribute

    categoryNameInput.addEventListener("blur", function () {
        const name = categoryNameInput.value.trim();

        if (name) {
            fetch(`/item-category/validate-category-name-edit/?name=${encodeURIComponent(name)}&exclude=${categoryId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        categoryNameErrorLabel.textContent = "Category name already exists.";
                        categoryNameErrorLabel.style.display = "inline";
                        categoryNameInput.classList.add("input-error");
                    } else {
                        categoryNameErrorLabel.textContent = "";
                        categoryNameErrorLabel.style.display = "none";
                        categoryNameInput.classList.remove("input-error");
                    }
                })
                .catch(error => {
                    console.error("Error checking category name:", error);
                });
        }
    });

    const saveButton = document.querySelector("button[type='submit']");
    const categoryForm = document.querySelector("form");

    if (!categoryNameInput || !saveButton || !categoryForm) {
        console.error("Required DOM elements are missing!");
        return;
    }

    saveButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default form submission

        const name = categoryNameInput.value.trim();

        if (name) {
            fetch(`/item-category/validate-category-name-edit/?name=${encodeURIComponent(name)}&exclude=${categoryId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        // Show alert if name already exists
                        alert("The category name already exists. Please use a different name.");
                    } else {
                        // Name is valid, submit the form
                        categoryForm.submit();
                    }
                })
                .catch(error => {
                    console.error("Error checking category name:", error);
                    alert("An error occurred while validating the category name. Please try again.");
                });
        } else {
            // Show alert if the name field is empty
            alert("Please enter a category name before saving.");
        }
    });

    // Handle Cancel Button Redirect with Popup Close
    cancelButton.addEventListener('click', function () {
        // Redirect using the data attributes
        const page = cancelButton.getAttribute('data-page') || 1;
        const rows = cancelButton.getAttribute('data-rows') || 10;
        const redirectUrl = `/item-category/?page=${page}&rows=${rows}`;
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 0);
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
