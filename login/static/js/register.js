const popup = document.getElementById('right-popup');
const popupMessage = document.getElementById('popup-message');

document.addEventListener("DOMContentLoaded", function () {
    // Password validation functionality
    const passwordInput = document.getElementById("password");
    const warning = document.getElementById("password-warning");
    const form = document.getElementById("registration-form");

    if (passwordInput && warning && form) {
        passwordInput.addEventListener("input", function () {
            if (passwordInput.value.length < 8) {
                warning.classList.remove("d-none");
            } else {
                warning.classList.add("d-none");
            }
        });

        form.addEventListener("submit", function (e) {
            if (passwordInput.value.length < 8) {
                e.preventDefault();
                Swal.fire({
                    title: "Error",
                    text: "Password must be at least 8 characters long.",
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
