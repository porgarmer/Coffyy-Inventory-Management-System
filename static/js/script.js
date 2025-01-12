const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function() {
    document.querySelector("#sidebar").classList.toggle("expand");
})

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