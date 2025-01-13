$(document).ready(function () {
    $("#mark-all-received").click(function () { 

        $('#item-table tbody tr').each(function () {
            // Get the Ordered and Received values for the current row
            let ordered = parseInt($(this).find('#item-qty').data("id")) || 0;
            let received = parseInt($(this).find('#item-received').data("id")) || 0;

            // Calculate the To Receive value
            let toReceive = ordered - received;

            // Set the To Receive input value
            $(this).find('#to-receive').val(toReceive);
        });
    });

    $("#receive-form").on("submit", function (e) {
        e.preventDefault();
        let isValid = true;
        let errorMessage = "";
        // Loop through each row to validate
        $("#item-table tbody tr").each(function () {
            let ordered = parseInt($(this).find('#item-qty').data("id")) || 0;
            let received = parseInt($(this).find('#item-received').data("id")) || 0;
            let toReceive = parseInt($(this).find('#to-receive').val()) || 0;

            if (toReceive + received > ordered ) {
                console.log("invalid")
                isValid = false;
                errorMessage = "The 'To Receive' amount cannot exceed the ordered quantity.";
            }
        });

        if (!isValid) {
            $("#alert-popup").remove(); // Remove any existing alert
            $("body").append(`
                <div id="alert-popup" class="alert alert-danger" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    ${errorMessage}
                </div>
            `);

            // Trigger the slide-in animation
            setTimeout(function () {
                $("#alert-popup").addClass("show");
            }, 100); 

             // Automatically hide the alert after 3 seconds
             setTimeout(function () {
                $("#alert-popup").removeClass("show");
                setTimeout(() => $("#alert-popup").remove(), 500); // Wait for slide-out animation
            }, 3000);
        } else {
            // Submit the form if all inputs are valid
            this.submit();
        }
    });
});