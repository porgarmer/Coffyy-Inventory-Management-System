// Handle forgot password form submission
        const forgotPasswordForm = document.getElementById('forgot-password-form');
        forgotPasswordForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission
            alert('A new password has been sent to your email address!');
            window.location.href = 'forgot_pass.html'; // Redirect to forgot_pass.html
        });
