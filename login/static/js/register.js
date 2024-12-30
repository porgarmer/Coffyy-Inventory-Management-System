  // Handle registration form submission
        const registrationForm = document.getElementById('registration-form');
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission
            alert('Account registration complete!');
            window.location.href = 'login.html'; // Redirect to the login page
        });
