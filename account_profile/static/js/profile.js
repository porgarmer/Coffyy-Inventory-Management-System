// Display popup messages if hidden success messages are present
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('right-popup');
    const popupMessage = document.getElementById('popup-message');

    const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
    hiddenMessages.forEach(message => {
        const trimmedMessage = message.textContent.trim();
        if (trimmedMessage) {
            popupMessage.textContent = trimmedMessage;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Hide popup after 3 seconds
        }
    });
});

// Function to enable editing of input fields
function enableEdit(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.removeAttribute('readonly');
        field.focus();
    }
}

// Open password edit modal
function editPassword() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// Show confirmation modal for saving changes
function saveChanges() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.add('show');
}

// Save profile changes
function confirmSave() {
    const contactNumber = document.getElementById('contact-number').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;

    fetch('/edit-account/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: 'update_profile',
            'contact-number': contactNumber,
            'first-name': firstName,
            'last-name': lastName,
            'email': email,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(data.message || 'Profile updated successfully!');
                location.reload();
            } else {
                alert(data.error || 'Failed to update profile.');
            }
        })
        .catch((error) => console.error('Error:', error));
}
document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const newPasswordWarning = document.getElementById("new-password-warning");
    const confirmPasswordWarning = document.getElementById("confirm-password-warning");

    // Validate new password length
    newPasswordInput.addEventListener("input", function () {
        if (newPasswordInput.value.length < 8) {
            newPasswordWarning.classList.remove("d-none");
        } else {
            newPasswordWarning.classList.add("d-none");
        }
    });

    // Validate password match
    confirmPasswordInput.addEventListener("input", function () {
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordWarning.classList.remove("d-none");
        } else {
            confirmPasswordWarning.classList.add("d-none");
        }
    });

    // Validate and save password
    window.validateAndSavePassword = function () {
        if (newPasswordInput.value.length < 8) {
            Swal.fire({
                title: "Error",
                text: "Password must be at least 8 characters long.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        // Call function to save the password (assumes `savePassword` is defined)
        savePassword();
    };
});
// Save password changes
function savePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch('/edit-account/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: 'update_password',
            password: newPassword,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(data.message || 'Password updated successfully!');
                closeModal('password-modal');
            } else {
                alert(data.error || 'Failed to update password.');
            }
        })
        .catch((error) => console.error('Error:', error));
}

// Function to open delete modal
function openDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// Handle account deletion
function confirmDelete() {
    fetch('/edit-account/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: 'delete_account',
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(data.message || 'Account deleted successfully!');
                window.location.href = '/login/'; // Redirect to login page
            } else {
                alert(data.error || 'Failed to delete account.');
            }
        })
        .catch((error) => console.error('Error:', error));
}
