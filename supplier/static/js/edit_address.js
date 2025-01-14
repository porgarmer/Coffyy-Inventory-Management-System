$(document).ready(function () { 

    $("#province").change(function () { 
        const municipalityOptions = $("#municipality");

        municipalityOptions.empty().append('<option value="" disabled selected>Loading...</option>').prop('disabled', true);
        const provinceCode = $("#province").find(":selected").val()
        const provinceName = $("#province").find(":selected").text()

        $.ajax({
            url: `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`, // Replace with your API endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {

                data.sort(function (a, b) {
                    return a.name.localeCompare(b.name); // Use 'value' if you want to order by value
                });
                municipalityOptions.empty().append('<option value="" disabled selected>Select an option</option>');
                data.forEach(item => {
                    if (item.name.includes("City of")) {
                        item.name = item.name.replace(/^City of\s(.+)$/, "$1 City")
                    }
                    municipalityOptions.append(new Option(item.name, item.code));
                });
                municipalityOptions.prop('disabled', false); // Enable the second dropdown
            },
            error: function () {
                municipalityOptions.empty().append('<option value="" disabled>Error loading municipalities</option>');
            }
        });

        $("#province-name").val(provinceName)
    });

    $("#municipality").change(function () {
        const barangayOptions = $("#barangay");

        barangayOptions.empty().append('<option value="" disabled selected>Loading...</option>').prop('disabled', true);
        const provinceCode = $("#province").find(":selected").val()
        const municipalityCode = $("#municipality").find(":selected").val()
        const municipalityName = $("#municipality").find(":selected").text()

        $.ajax({
            url: `https://psgc.gitlab.io/api/provinces/${provinceCode}/barangays/`, // Replace with your API endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                
                const barangays = data.filter(item => item.municipalityCode === municipalityCode || item.cityCode === municipalityCode);
                barangays.sort(function (a, b) {
                    return a.name.localeCompare(b.name); // Use 'value' if you want to order by value
                });

                barangayOptions.empty().append('<option value="" disabled selected>Select an option</option>');
                barangays.forEach(item => {
                    barangayOptions.append(new Option(item.name, item.code));
                });
                barangayOptions.prop('disabled', false); // Enable the second dropdown
            },
            error: function () {
                barangayOptions.empty().append('<option value="" disabled>Error loading barangays</option>');
            }
        });
    
        $("#municipality-name").val(municipalityName)
    })

    $("#barangay").change(function () {
        const barangayName = $("#barangay").find(":selected").text()
    
        $("#barangay-name").val(barangayName)
    })

 })