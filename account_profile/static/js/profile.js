document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const contactNumberInput = document.getElementById("contact-number");
    const contactWarning = document.getElementById("contact-warning");
    const emailInput = document.getElementById("email");
    const emailWarning = document.getElementById("email-warning");
    const popup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    const passwordWarning = document.getElementById("new-password-warning");
    const confirmPasswordWarning = document.getElementById("confirm-password-warning");

    const editFields = ["contact-number", "first-name", "last-name", "email"];
    const originalValues = {};

    // Store original values for reset
    editFields.forEach((field) => {
        const input = document.getElementById(field);
        originalValues[field] = input.value;
    });

    window.enableEdit = function (fieldId) {
        const input = document.getElementById(fieldId);
        input.readOnly = false;
        input.classList.add("editable");
        input.focus();
    };

    contactNumberInput.addEventListener("input", function () {
        if (contactNumberInput.value.length !== 11 || isNaN(contactNumberInput.value)) {
            contactWarning.classList.remove("d-none");
        } else {
            contactWarning.classList.add("d-none");
        }
    });

    // Email validation
    emailInput.addEventListener("input", function () {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            emailWarning.classList.remove("d-none");
        } else {
            emailWarning.classList.add("d-none");
        }
    });

    // Real-time password validation
    newPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value;
        
        if (newPassword.length < 8) {
            passwordWarning.classList.remove("d-none");
        } else {
            passwordWarning.classList.add("d-none");
        }

        // Check if passwords match
        if (confirmPasswordInput.value && confirmPasswordInput.value !== newPassword) {
            confirmPasswordWarning.classList.remove("d-none");
        } else {
            confirmPasswordWarning.classList.add("d-none");
        }
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener("input", function () {
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword !== newPasswordInput.value) {
            confirmPasswordWarning.classList.remove("d-none");
        } else {
            confirmPasswordWarning.classList.add("d-none");
        }
    });

    window.editPassword = function () {
        const passwordModal = document.getElementById("password-modal");
        passwordModal.classList.add("show");
    };

    // Open modal by ID
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show'); // Show the modal
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show'); // Hide the modal
        }
    };

    // Open delete modal
    window.openDeleteModal = function () {
        const deleteModal = document.getElementById("delete-modal");
        deleteModal.classList.add("show"); // Show the delete modal
    };

    // Close delete modal
    window.closeDeleteModal = function () {
        const deleteModal = document.getElementById("delete-modal");
        deleteModal.classList.remove("show"); // Hide the delete modal
    };

    window.confirmSave = function () {
        const contactNumber = contactNumberInput.value;
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = emailInput.value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (contactNumber.length !== 11 || isNaN(contactNumber)) {
            contactWarning.classList.remove("d-none");
            return;
        }
        if (!emailPattern.test(email)) {
            emailWarning.classList.remove("d-none");
            return;
        }

        fetch("{% url 'account_profile:edit_account' %}", {
            method: "POST",
            headers: {
                "X-CSRFToken": "{{ csrf_token }}",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: "update_profile",
                "contact-number": contactNumber,
                "first-name": firstName,
                "last-name": lastName,
                email: email,
            }),
        })
            .then(() => {
                location.reload(); // Refresh page to get updated hidden messages from backend
            })
            .catch(() => {
                displayPopupMessage("An error occurred. Please try again.");
            });
    };

    window.confirmDelete = function () {
        fetch("{% url 'account_profile:delete_account' %}", {
            method: "POST",
            headers: {
                "X-CSRFToken": "{{ csrf_token }}",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: "delete_account",
            }),
        })
            .then(() => {
                location.reload(); // Refresh page to get updated hidden messages from backend
            })
            .catch(() => {
                displayPopupMessage("An error occurred. Please try again.");
            });
    };

    // Save password function
    window.savePassword = function () {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check if password is valid and confirm password matches
        if (newPassword.length < 8) {
            passwordWarning.classList.remove("d-none");
            return;
        }
        if (newPassword !== confirmPassword) {
            confirmPasswordWarning.classList.remove("d-none");
            return;
        }

        fetch("{% url 'account_profile:edit_account' %}", {
            method: "POST",
            headers: {
                "X-CSRFToken": "{{ csrf_token }}",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: "update_password",
                password: newPassword,
            }),
        })
            .then(() => {
                location.reload(); // Refresh page to get updated hidden messages from backend
            })
            .catch(() => {
                displayPopupMessage("An error occurred. Please try again.");
            });
    };

    // Function to display popup messages
    function displayPopupMessage(message) {
        popupMessage.textContent = message;
        popup.classList.add("show");
        setTimeout(() => {
            popup.classList.remove("show");
        }, 3000);
    }

    // Process hidden messages from backend
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        const trimmedMessage = message.textContent.trim();
        if (trimmedMessage) {
            displayPopupMessage(trimmedMessage);
        }
    });

    // Redirect to dashboard function
    window.redirectToDashboard = function () {
        window.location.href = "{% url 'index' %}"; // Redirect to the dashboard
    };

    // Attach redirect function to cancel buttons
    const cancelButtons = document.querySelectorAll(".cancel-button");
    cancelButtons.forEach(button => {
        button.addEventListener("click", function () {
            redirectToDashboard(); // Redirect to dashboard when cancel is clicked
        });
    });
});
