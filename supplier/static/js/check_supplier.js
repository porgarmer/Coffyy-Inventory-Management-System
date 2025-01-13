$(document).ready(function () {
    $("#supplier-form").on("submit", function (e) { 
        e.preventDefault()
        const supplierToBeAdded = $("#supplierName").val();
        $.ajax({
            type: "GET",
            url: `check-supplier/${supplierToBeAdded}`,
            dataType: "JSON",
            success: function (data) {
                if (data.supplierExists === true) {
                    const errorMessage = "A supplier with that name already exists!";
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
                    // Submit the form if the supplier doesn't exist
                    $("#supplier-form")[0].submit();
                }
            }
        });
    });
});