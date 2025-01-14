$(document).ready(function () {
    $(".item-row").on("click", function () {
        const id = $(this).data("id");
        if (id) {
            window.location.href = `/item-request/details/${id}`;
        }
    });

    // Prevent row click when clicking the checkbox
    $("input[type='checkbox']").on("click", function (event) {
        event.stopPropagation();
    });
});




const popup = document.getElementById('right-popup');
const popupMessage = document.getElementById('popup-message')

// Display popup messages if hidden success messages are present
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
