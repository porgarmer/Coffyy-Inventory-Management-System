//Add purchase order scripts.

$(document).ready(function() {
    $('#supplier').select2({
        width: '100%',
        placeholder: "Select supplier",
    });


    $("#purchase-form").on("submit", function (e) {
        // Get the values from the date inputs
        const purchaseOrderDate = new Date($("#purchaseOrderDate").val());
        const expectedDate = new Date($("#expectedDate").val());
    
        // Validate the dates
        if (expectedDate < purchaseOrderDate) {
          // Prevent form submission
          e.preventDefault();
    
          // Show the alert text
          $("#date-alert").fadeIn();
        } else {
          // Hide the alert text (optional)
          $("#date-alert").fadeOut();
        }
      });

    $("#expectedDate").on("change", function () {
        // Get the values from the date inputs
        const purchaseOrderDate = new Date($("#purchaseOrderDate").val());
        const expectedDate = new Date($(this).val());
    
        // Compare the dates
        if (expectedDate >= purchaseOrderDate) {
            $("#date-alert").fadeOut();
          }
      });




    $('#item').select2({
        width: '100%',
        placeholder: "Select item",
        theme: 'custom-theme'
    });

    let rowIndex = 0; // Track the row index

    $('#item').on("select2:select", function (params) {
        data = JSON.parse(params.params.data.id)
        console.log(data)

        let html = "";
        html += "<tr>";
        html += `<td style="display: none"><input type="hidden" name="items-${rowIndex}-id" value="${data.item_id}"></td>`
        html += `<td>${data.item_name}</td>`
        html += `<td>${data.item_in_stock}</td>`
        html += `<td>0</td>`
        html += `<td>
                    <input type="number" name="items-${rowIndex}-quantity" class="form-control quantity" min="0" value="0" 
                    onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" >
                </td>`  
        html += `<td>
                    <input type="number" id="purchase-cost" name="items-${rowIndex}-purchase-cost" class="form-control purchase-cost" min="0.00" value="0.00"
                    onkeypress="return (event.charCode !=8 && event.charCode ==0 || ( event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)))">
                </td>`
        html += `<td class="amount">
                    <input type="number" name="items-${rowIndex}-amount" id="amount" value="0.00" readonly>
                </td>`
        html += `<td>
                    <button name="remove" class="btn btn-danger btn-sm remove">Delete</button>
                </td>`
        html += "</tr>"

        $("#item_table").append(html);
        $(this).val(null).trigger('change');

        rowIndex++;

    })

    function calculateAmount($row) {
        const quantity = parseFloat($row.find(".quantity").val()) || 0;
        const purchaseCost = parseFloat($row.find(".purchase-cost").val()) || 0;
        const amount = quantity * purchaseCost;
        $row.find("#amount").val(amount.toFixed(2));
        
        return amount;
    }

    function calculateTotalAmount() {
        let total = 0;
        $("#item_table tbody tr").each(function () {
          total += calculateAmount($(this));
        });
        $("#items-total-amount").val(total.toFixed(2));
      }

    $("#item_table").on("click", ".remove", function () {
        $(this).closest("tr").remove();
        calculateTotalAmount()
    })


    $("#item_table").on("input", ".quantity, .purchase-cost", function () {
        calculateTotalAmount();
      });

});

