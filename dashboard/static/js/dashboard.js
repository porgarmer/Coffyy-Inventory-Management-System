document.addEventListener("DOMContentLoaded", function () {
    // Get the user's role from the data attribute
    const dashboard = document.getElementById("dashboard");
    const userRole = dashboard.dataset.userRole;

    // Check if the user role is not "owner"
    if (userRole !== "owner") {
        // Hide the employee card
        const employeeCard = document.querySelector(".employee-card");
        if (employeeCard) {
            employeeCard.style.display = "none";
        }
    }
});
