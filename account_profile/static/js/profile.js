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

    //save function
    window.confirmSave = function () {
        const contactNumberInput = document.getElementById("contact-number");
        const emailInput = document.getElementById("email");
        const firstNameInput = document.getElementById("first-name");
        const lastNameInput = document.getElementById("last-name");
        const contactWarning = document.getElementById("contact-warning");
        const emailWarning = document.getElementById("email-warning");
    
        if (!contactNumberInput || !emailInput || !firstNameInput || !lastNameInput) {
            console.error("One or more required inputs are missing from the DOM.");
            displayPopupMessage("Some fields are missing. Please reload the page.");
            return;
        }
    
        const contactNumber = contactNumberInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
    
        console.log("Contact Number:", contactNumber);
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Email:", email);
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
    
        // Validate contact number
        if (contactNumber.length !== 11 || isNaN(contactNumber)) {
            console.error("Invalid contact number.");
            contactWarning.textContent = "Contact number must be 11 digits.";
            contactWarning.classList.remove("d-none");
            isValid = false;
        } else {
            contactWarning.classList.add("d-none");
        }
    
        // Validate email format
        if (!emailPattern.test(email)) {
            console.error("Invalid email format.");
            emailWarning.textContent = "Please enter a valid email address.";
            emailWarning.classList.remove("d-none");
            isValid = false;
        } else {
            emailWarning.classList.add("d-none");
        }
    
        if (!isValid) {
            displayPopupMessage("Please fix the errors and try again.");
            return;
        }
    
        // CSRF token and AJAX update profile request
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch("/account-profile/edit/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
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
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    displayPopupMessage("Profile updated successfully!");
                    setTimeout(() => location.reload(), 1000);
                } else if (data.error === "Contact number already exists. Please use a different one.") {
                    closeModal("confirm-modal");
                    displayPopupMessage(data.error);
                } else {
                    displayPopupMessage(data.error || "An error occurred while updating the profile.");
                }
            })
            .catch((error) => {
                displayPopupMessage("An error occurred. Please try again.");
                console.error("Error:", error);
            });
    };
    
    
    // Save password function
    window.savePassword = function () {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
    
        // Validate password
        if (newPassword.length < 8) {
            passwordWarning.classList.remove("d-none");
            return;
        }
        if (newPassword !== confirmPassword) {
            confirmPasswordWarning.classList.remove("d-none");
            return;
        }
    
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch("/account-profile/update-password/", {  // Updated URL
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: newPassword }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayPopupMessage("Password updated successfully!");
                    setTimeout(() => location.reload(), 1000);
                } else {
                    displayPopupMessage(data.error || "An error occurred.");
                }
            })
            .catch(error => {
                displayPopupMessage("An error occurred. Please try again.");
                console.error("Error:", error);
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

    // Function to confirm account deletion
    window.confirmDelete = function () {
        fetch("/account-profile/delete-account/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value, // CSRF token for security
            },
        })
        .then((response) => {
            return response.json().then((data) => {
                if (response.ok) {
                    displayPopupMessage("Account deleted successfully.");
                    setTimeout(() => {
                        window.location.href = data.redirect || '/login/'; // Redirect to login page after success
                    }, 1500); 
                } else {
                    // General error message if response is not OK
                    alert("Failed to delete account. Please try again.");
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    };
    });
