document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const usernameWarning = document.getElementById("username-warning");
    const passwordWarning = document.getElementById("password-warning");
    const confirmPasswordWarning = document.getElementById("confirm-password-warning");

    // Function to validate the username field
    function validateUsername() {
        if (!usernameInput.value.trim()) {
            usernameWarning.textContent = "Username is required.";
            usernameWarning.classList.remove("d-none");
        } else {
            usernameWarning.classList.add("d-none");
        }
    }

    // Function to validate the password field
    function validatePassword() {
        if (passwordInput.value.length < 8) {
            passwordWarning.textContent = "Password must be at least 8 characters long.";
            passwordWarning.classList.remove("d-none");
        } else {
            passwordWarning.classList.add("d-none");
        }

        // Also validate the confirm password field when the password changes
        validateConfirmPassword();
    }

    // Function to validate the confirm password field
    function validateConfirmPassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordWarning.textContent = "Passwords do not match.";
            confirmPasswordWarning.classList.remove("d-none");
        } else {
            confirmPasswordWarning.classList.add("d-none");
        }
    }

    // Attach real-time validation to input events
    usernameInput.addEventListener("input", validateUsername);
    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validateConfirmPassword);

    // Optional: Prevent form submission if there are errors
    const form = document.getElementById("forgot-password-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            validateUsername();
            validatePassword();
            validateConfirmPassword();

            const isUsernameValid = !usernameWarning.classList.contains("d-none");
            const isPasswordValid = !passwordWarning.classList.contains("d-none");
            const isConfirmPasswordValid = !confirmPasswordWarning.classList.contains("d-none");

            if (isUsernameValid || isPasswordValid || isConfirmPasswordValid) {
                e.preventDefault();
                Swal.fire({
                    title: "Error",
                    text: "Please fix the errors before submitting.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        });
    }
});


    // Display popup messages if hidden messages are present
    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    const popup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    hiddenMessages.forEach((message) => {
        const trimmedMessage = message.textContent.trim();
        if (trimmedMessage) {
            popupMessage.textContent = trimmedMessage;
            popup.classList.add("show");

            setTimeout(() => {
                popup.classList.remove("show");
            }, 3000); // Hide popup after 3 seconds
        }
    });
