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

        
        // Check if there are items
        const rowCount = $("#item_table_body tr").length
        errorMessage = "Please select an item.";

        if (rowCount === 0){
          e.preventDefault();

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
        }
        else{
          e.preventDefault()
          let isValid = true; // Flag to track if all inputs are valid

            //Check if items has quantity
          $("#item_table tbody tr").each(function () {
              const itemQuantityInput = $(this).find("#item-quantity")

              const itemQuantity = parseInt(itemQuantityInput.val())
              
              if (itemQuantity === 0 || isNaN(itemQuantity)) {
                  isValid = false
                  itemQuantityInput.addClass("no-item-quantity")

                  let errorMessage = "Please enter quantity.";
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
              }
              else{
                itemQuantityInput.removeClass("no-item-quantity")
              }
          });
          
          if (isValid) {
            this.submit()
          }

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
      const selectedItem = parseInt(JSON.parse($(this).val()).item_id)
      console.log("selected item:", selectedItem);

      let exists = false;
      $("#item_table tbody tr").each(function () { 
        const itemId = $(this).find("td:first input[type='hidden']")
        const itemIdVal = parseInt(itemId.val());


        if (selectedItem === itemIdVal) {
            exists = true;
            return false;
        }
      })

      if (exists) {
        // alert('This item is already in the table!');
        const itemExistsModal = new bootstrap.Modal(document.getElementById('item-exists'));
        itemExistsModal.show();
        $(this).val(null).trigger('change');
      }else{

      
        data = JSON.parse(params.params.data.id);
        let html = "";
        html += "<tr>";
        html += `<td style="display: none"><input type="hidden" class="id-of-item" name="items-${rowIndex}-id" value="${data.item_id}"></td>`
        html += `<td>${data.item_name}</td>`
        html += `<td>${data.item_in_stock}</td>`
        // html += `<td>0</td>`
        html += `<td>
                  <input id="item-quantity" type="number" name="items-${rowIndex}-quantity" class="form-control quantity" min="0" value="0" 
                  onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" >
              </td>`  
        html += `<td>
                  <input type="number" id="purchase-cost" name="items-${rowIndex}-purchase-cost" class="form-control purchase-cost" min="0.00" value="${data.item_purchase_cost}" step="0.01" 
                  onkeypress="return (event.charCode !=8 && event.charCode ==0 || ( event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)))" readonly>
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
      }

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


    $('.existing-item').on('click', function() {
        const itemId = $(this).data('item-id');  // Get the item ID from a data attribute
        const row = $(this).closest('tr');  // Get the table row to be removed

        // Remove the row from the table
        row.remove();    
        calculateTotalAmount()
   
        // Add the deleted item's ID to the hidden input field
        let deletedItems = $('#deleted-items').val();
        if (deletedItems) {
            deletedItems = deletedItems + ',' + itemId;  // Append to the list of deleted items
        } else {
            deletedItems = itemId;  // Start the list with the first item ID
        }

        // Update the value of the hidden input field
        $('#deleted-items').val(deletedItems);
    });

});

