document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const usernameWarning = document.getElementById("username-warning");
    const passwordWarning = document.getElementById("password-warning");
    const confirmPasswordWarning = document.getElementById("confirm-password-warning");

    const form = document.getElementById("forgot-password-form");

    if (form) {
        form.addEventListener("submit", function (e) {
            let isValid = true;

            // Validate username input
            if (!usernameInput || !usernameInput.value.trim()) {
                usernameWarning.textContent = "Username is required.";
                usernameWarning.classList.remove("d-none");
                isValid = false;
            } else {
                usernameWarning.classList.add("d-none");
            }

            // Validate password length
            if (!passwordInput || passwordInput.value.length < 8) {
                passwordWarning.textContent = "Password must be at least 8 characters long.";
                passwordWarning.classList.remove("d-none");
                isValid = false;
            } else {
                passwordWarning.classList.add("d-none");
            }

            // Validate password confirmation
            if (
                !confirmPasswordInput ||
                passwordInput.value !== confirmPasswordInput.value
            ) {
                confirmPasswordWarning.textContent = "Passwords do not match.";
                confirmPasswordWarning.classList.remove("d-none");
                isValid = false;
            } else {
                confirmPasswordWarning.classList.add("d-none");
            }

            // Prevent form submission if validation fails
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

    // Display popup messages if hidden messages are present
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    const popup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    hiddenMessages.forEach(message => {
        const trimmedMessage = message.textContent.trim();
        if (trimmedMessage) {
            popupMessage.textContent = trimmedMessage;
            popup.classList.add("show");

            setTimeout(() => {
                popup.classList.remove("show");
            }, 3000); // Hide popup after 3 seconds
        }
    });
});
