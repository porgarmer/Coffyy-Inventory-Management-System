// Validate Passwords Match and Show Confirmation Message
        const form = document.getElementById('forgot-password-form');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Passwords do not match!');
            } else {
                alert('Password changed successfully!');
                window.location.href = 'login.html'; // Redirect to login page
            }
        });
