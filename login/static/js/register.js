const popup = document.getElementById('right-popup');
const popupMessage = document.getElementById('popup-message');

document.addEventListener("DOMContentLoaded", function () {
    // Password validation functionality
    const passwordInput = document.getElementById("password");
    const passwordWarning = document.getElementById("password-warning");
    const contactInput = document.getElementById("contact-number");
    const contactWarning = document.getElementById("contact-warning");
    const form = document.getElementById("registration-form");

    if (form) {
        // Password validation
        if (passwordInput && passwordWarning) {
            passwordInput.addEventListener("input", function () {
                if (passwordInput.value.length < 8) {
                    passwordWarning.classList.remove("d-none");
                } else {
                    passwordWarning.classList.add("d-none");
                }
            });
        }

        // Contact number validation
        if (contactInput && contactWarning) {
            contactInput.addEventListener("input", function () {
                if (contactInput.value.length !== 11 || isNaN(contactInput.value)) {
                    contactWarning.classList.remove("d-none");
                } else {
                    contactWarning.classList.add("d-none");
                }
            });
        }

        // Form submission validation
        form.addEventListener("submit", function (e) {
            let isValid = true;

            if (passwordInput && passwordInput.value.length < 8) {
                isValid = false;
                passwordWarning.classList.remove("d-none");
            }

            if (contactInput && (contactInput.value.length !== 11 || isNaN(contactInput.value))) {
                isValid = false;
                contactWarning.classList.remove("d-none");
            }

            if (!isValid) {
                e.preventDefault();
                Swal.fire({
                    title: "Error",
                    text: "Please fix the errors before submitting.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        });
    }

    // Display popup messages if hidden success messages are present
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        const trimmedMessage = message.textContent.trim();
        console.log("Message Found:", trimmedMessage); // Debug: Check if message is retrieved
        if (trimmedMessage) {
            popupMessage.textContent = trimmedMessage;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Hide popup after 3 seconds
        }
    });
});
