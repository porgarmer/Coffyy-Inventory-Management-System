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


     // Function to programmatically show the modal
     function showDenyReasonModal(requestId) {
        // Store the request ID in the modal for reference
        $("#denyReasonModal").data("requestId", requestId).modal("show");
    }

    // Handle form submission
    $("#submitDenyReason").on("click", function () {
        const requestId = $("#denyReasonModal").data("requestId"); // Retrieve the stored request ID
        const reason = $("#denyReason").val().trim();

        if (reason === "") {
            alert("Please provide a reason for denial.");
            return;
        }

        // Example AJAX call to submit the reason
        $.ajax({
            type: "POST",
            url: `/item-request/deny_item_request/${requestId}`, // Adjust the URL to your endpoint
            data: {
                reason: reason,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(), // CSRF token for Django
            },
            success: function (response) {
                // Handle success
                $("#denyReasonModal").modal("hide");
                location.reload()
            },
            error: function (error) {
                // Handle error
                alert("An error occurred while denying the request.");
            },
        });
    });

    // Example: Show the modal when clicking a button
    $(".btn-deny").on("click", function () {
        const requestId = $(this).data("id"); // Retrieve the request ID from the button
        showDenyReasonModal(requestId);
    });

});




// const popup = document.getElementById('right-popup');
// const popupMessage = document.getElementById('popup-message')

// // Display popup messages if hidden success messages are present
// const hiddenMessages = document.querySelectorAll('div[style="display:none;"] p');
// hiddenMessages.forEach(message => {
//     const trimmedMessage = message.textContent.trim();
//     if (trimmedMessage) {
//         popupMessage.textContent = trimmedMessage;
//         popup.classList.add('show');
//         setTimeout(() => {
//             popup.classList.remove('show');
//         }, 3000); // Hide popup after 3 seconds
//     }
// });
