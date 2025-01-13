$(document).ready(function () {
    $(".item-row").on("click", function () {
        const suppId = $(this).data("id");
        if (suppId) {
            window.location.href = `edit/${suppId}`;
        }
    });

    // Prevent row click when clicking the checkbox
    $("input[type='checkbox']").on("click", function (event) {
        event.stopPropagation();
    });
});




