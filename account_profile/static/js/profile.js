const popup = document.getElementById('right-popup');
const popupMessage = document.getElementById('popup-message');

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

function enableEdit(fieldId) {
    const field = document.getElementById(fieldId);
    field.removeAttribute('readonly');
    field.focus();
}

function editPassword() {
    document.getElementById('password-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function saveChanges() {
    document.getElementById('confirm-modal').classList.add('show');
}

function confirmSave() {
    const contactNumber = document.getElementById('contact-number').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;

    fetch('/update-profile/', {
        method: 'POST',
        headers: { 
            'X-CSRFToken': '{{ csrf_token }}', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            contactNumber, 
            firstName, 
            lastName, 
            email 
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            closeModal('confirm-modal');
        });
}

function savePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    fetch('/update-password/', {
        method: 'POST',
        headers: { 
            'X-CSRFToken': '{{ csrf_token }}', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ password: newPassword })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            closeModal('password-modal');
        });
}

// Function to show the delete account confirmation modal
function deleteAccount() {
    document.getElementById('delete-modal').classList.add('show');
}

// Function to close the modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Function to handle account deletion after confirmation
function confirmDeletion() {
    fetch('/delete-account/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        closeModal('delete-modal'); // Close the modal
        window.location.href = '/login/'; // Redirect to login page
    })
    .catch(error => {
        alert('Error: ' + error);
        closeModal('delete-modal');
    });
}
