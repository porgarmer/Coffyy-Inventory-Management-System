document.addEventListener("DOMContentLoaded", () => {
    // Sold By Logic
    const soldByEach = document.getElementById("sold-by-each");
    const soldByVolumeWeight = document.getElementById("sold-by-volume-weight");
    const volumeWeightGroup = document.getElementById("volume-weight-group");
    const remainingVolumeGroup = document.getElementById("remaining-volume-group");

    // Composite Item Logic
    const compositeItemCheckbox = document.getElementById("composite-item");
    const compositeItemTable = document.getElementById("composite-item-table");
    const totalCostLabel = document.getElementById("total-cost");
    const costInput = document.getElementById("cost");

    // Remaining Volume Field
    const inStockInput = document.getElementById("in-stock");
    const volumeWeightInput = document.getElementById("volume-weight-per-unit");
    const remainingVolumeOutput = document.getElementById("remaining-volume");

    const reorderLevelInput = document.getElementById("reorder-level");
    const optimalStockInput = document.getElementById("optimal-stock");

    // Search Bar and Dropdown Logic
    const searchInput = document.getElementById("composite-item-search");
    const searchResults = document.getElementById("search-results");

    const cancelButton = document.getElementById("cancel-button");
    const rightPopup = document.getElementById("right-popup");
    const popupMessage = document.getElementById("popup-message");

    const saveButton = document.querySelector("button[type='submit']");
    const compositeToggle = document.getElementById("composite-item");
    
    const itemNameInput = document.getElementById("item-name");
    const nameErrorLabel = document.createElement("span");
    nameErrorLabel.style.color = "red";
    nameErrorLabel.style.display = "none";
    
    itemNameInput.parentNode.appendChild(nameErrorLabel);

    itemNameInput.addEventListener("blur", function () {
        const name = itemNameInput.value.trim();
        const currentItemId = itemNameInput.dataset.currentItemId; // Assuming this is set on the input
        if (name) {
            fetch(`/item-list/check-item-name/?name=${encodeURIComponent(name)}&current_item_id=${encodeURIComponent(currentItemId)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists && data.is_current !== true) {
                        nameErrorLabel.textContent = "This name already exists.";
                        nameErrorLabel.style.display = "inline";
                        itemNameInput.classList.add("input-error");
                    } else {
                        nameErrorLabel.textContent = "";
                        nameErrorLabel.style.display = "none";
                        itemNameInput.classList.remove("input-error");
                    }
                })
                .catch(error => {
                    console.error("Error checking item name:", error);
                });
        }
    });

    // Function to log composite item data
    const collectCompositeItemData = () => {
        const rows = compositeItemTable.querySelectorAll("tbody tr");
        const itemsData = [];
    
        rows.forEach((row) => {
            const itemName = row.querySelector("td").textContent.trim(); // Name from first <td>
            const quantityInput = row.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput.value, 10) || 0;
    
            itemsData.push({
                item_name: itemName,
                quantity: quantity,
            });
        });
    
        return itemsData;
    };
    
    // Function to validate required fields
    const validateRequiredFields = () => {
        const requiredFields = document.querySelectorAll("input[required], textarea[required], select[required]");
        let isValid = true;
    
        // Flag to track if non-composite required fields are valid
        let nonCompositeValid = true;
    
        requiredFields.forEach((field) => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add("error"); // Add error class for visual indication
                if (!field.closest("#composite-item-table")) {
                    nonCompositeValid = false; // Track if non-composite fields are invalid
                }
            } else {
                field.classList.remove("error"); // Remove error class if field is valid
            }
        });
    
        // Validate composite item table only if the checkbox is checked
        if (compositeItemCheckbox.checked) {
            const compositeItemRows = compositeItemTable.querySelectorAll("tbody tr");
        
            if (compositeItemRows.length === 0) {
                // No rows added to the composite table
                Swal.fire({
                    title: "Error",
                    text: "Please add composite items to the table.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                isValid = false;
                compositeItemTable.classList.add("error");
            } else {
                // Check if all rows have valid quantities
                const invalidRows = Array.from(compositeItemRows).filter(row => {
                    const quantityInput = row.querySelector(".quantity-input");
                    return !quantityInput || parseInt(quantityInput.value, 10) <= 0;
                });
        
                if (invalidRows.length > 0) {
                    Swal.fire({
                        title: "Error",
                        text: "All composite items must have a quantity greater than 0.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    isValid = false;
                    compositeItemTable.classList.add("error");
                } else {
                    compositeItemTable.classList.remove("error");
                }
            }
        }
        
    
        // Separate alerts based on the validation results
        if (!nonCompositeValid) {
            Swal.fire({
                title: "Error",
                text: "Please fill out all required fields.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    
        return isValid;
    };    
    
    const isNameValid = () => {
        return nameErrorLabel.style.display === "none";
    };

    const areQuantitiesValid = () => {
        const quantityInputs = compositeItemTable.querySelectorAll(".quantity-input");
        let isValid = true;
    
        quantityInputs.forEach((input) => {
            if (input.classList.contains("quantity-zero")) {
                isValid = false; // Found invalid quantity
            }
        });
    
        return isValid;
    };

    const validateMaxConstraints = () => {
        let isValid = true; // Flag to track if all constraints are valid
        const allInputs = document.querySelectorAll("input[type='number']");
        allInputs.forEach((input) => {
            const max = parseFloat(input.getAttribute("max"));
            if (!isNaN(max) && parseFloat(input.value) > max) {
                input.value = max; // Enforce max value
                Swal.fire({
                    title: "Error",
                    text: `Value for ${input.name || "field"} cannot exceed ${max}.`,
                    icon: "error",
                    confirmButtonText: "OK"
                });
                isValid = false; // Mark as invalid
            }
        });
        return isValid; // Return the validation status
    };

    if (saveButton) {
        saveButton.addEventListener("click", (e) => {
            // Step 1: Validate required fields before proceeding

            if (!validateMaxConstraints()) {
                e.preventDefault(); // Stop form submission if validation fails
                return;
            }
            
            if (!validateRequiredFields()) {
                e.preventDefault(); // Prevent form submission if validation fails
                return;
            }
            
            // Step 2: Check name validation
            if (!isNameValid()) {
                e.preventDefault();
                Swal.fire({
                    title: "Error",
                    text: "The item name is invalid or already exists. Please fix it before saving.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }


            // Step 4: Check Volume/Weight per Unit
            if (soldByVolumeWeight.checked) {
                const volumeWeightValue = parseFloat(volumeWeightInput.value) || 0;
                if (volumeWeightValue <= 0) {
                    e.preventDefault();
                    Swal.fire({
                        title: "Error",
                        text: "Volume/Weight per unit cannot be zero. Please provide a valid value.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    return;
                }
            }

            const form = document.querySelector("form");

            // Set blank fields (in-stock, optimal-stock, reorder-level) to 0 if they are empty
            if (!inStockInput.value.trim()) {
                inStockInput.value = "0";
            }
            if (!optimalStockInput.value.trim()) {
                optimalStockInput.value = "0";
            }
            if (!reorderLevelInput.value.trim()) {
                reorderLevelInput.value = "0";
            }

            console.log(reorderLevelInput.value)
            console.log(reorderLevelInput.value)
            console.log(reorderLevelInput.value)
            
            // Step 2: If composite item toggle is checked, proceed with collecting composite item data
            if (compositeToggle.checked) {
                e.preventDefault(); // Prevent default form submission
                
                // Step 3: Check quantity validation
                if (!areQuantitiesValid()) {
                    e.preventDefault();
                    Swal.fire({
                        title: "Error",
                        text: "Some quantities in the composite table are zero. Please correct them before saving.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    return;
                }

                const compositeItemsData = collectCompositeItemData(); // Collect composite item data
                console.log("Composite Items Data:", compositeItemsData);
    
                
    
                // Step 3: Append composite item data as a hidden input field
                const hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = "composite_items_data";
                hiddenInput.value = JSON.stringify(compositeItemsData);
    
                form.appendChild(hiddenInput);
    
                // Step 4: Submit the form after appending the composite data
                form.submit();
            }
        });
    }
    
    

    // Track added composite items
    let addedItems = [];

    if (rightPopup && popupMessage) {
        const messages = document.querySelector(".messages");
        if (messages) {
            const messageText = messages.textContent.trim();
            if (messageText) {
                popupMessage.textContent = messageText; // Set the popup message
                rightPopup.style.display = "block"; // Show the popup

                // Auto-hide the popup after 3 seconds
                setTimeout(() => {
                    rightPopup.style.display = "none";
                }, 3000);
            }
        }
    }

    cancelButton.addEventListener("click", () => {
        // Retrieve the session-stored page and rows values via data attributes
        const currentPage = cancelButton.getAttribute('data-page') || 1;
        const currentRows = cancelButton.getAttribute('data-rows') || 10;
    
        console.log("Redirecting to page:", currentPage, "with rows:", currentRows);
    
        // Construct the redirection URL
        const redirectUrl = `/item-list/?page=${currentPage}&rows=${currentRows}`;
        window.location.href = redirectUrl;
    });
    
    // Allow radio buttons to be deselected
    document.querySelectorAll("input[type='radio']").forEach((radio) => {
        radio.addEventListener("mousedown", (e) => {
            if (radio.checked) {
                // If already checked, add a custom attribute to track deselection
                radio.dataset.wasChecked = "true";
            } else {
                delete radio.dataset.wasChecked;
            }
        });

        radio.addEventListener("click", (e) => {
            if (radio.dataset.wasChecked === "true") {
                // If it was already checked, deselect it
                radio.checked = false;
                delete radio.dataset.wasChecked;
                // Trigger the change event for consistency
                radio.dispatchEvent(new Event("change"));
            }
        });
    });
    // Function to toggle visibility for Volume/Weight groups
    const toggleVolumeWeightGroup = () => {
        if (soldByVolumeWeight.checked) {
            volumeWeightGroup.style.display = "block";
            remainingVolumeGroup.style.display = "block";
        } else {
            volumeWeightGroup.style.display = "none";
            remainingVolumeGroup.style.display = "none";
        }
    };

    // Function to toggle visibility for Composite Item Table
    const toggleCompositeItemTable = () => {
        if (compositeItemCheckbox.checked) {
            compositeItemTable.style.display = "block";
            costInput.readOnly = true; // Make cost input readonly
            costInput.value = totalCostLabel.textContent || "0.00"; // Set to total cost value
        } else {
            compositeItemTable.style.display = "none";
            costInput.readOnly = false; // Allow manual editing
            costInput.value = "0.00"; // Reset to default
        }
    };
    
    const toggleSoldByOptions = () => {
        const isComposite = compositeItemCheckbox.checked;
    
        if (isComposite) {
            // Disable and uncheck the radio buttons
            soldByEach.disabled = true;
            soldByVolumeWeight.disabled = true;
            soldByEach.checked = false;
            soldByVolumeWeight.checked = false;
    
            // Hide the associated elements for "Volume/Weight"
            volumeWeightGroup.style.display = "none";
            remainingVolumeGroup.style.display = "none";
        } else {
            // Enable the radio buttons
            soldByEach.disabled = false;
            soldByVolumeWeight.disabled = false;
    
            // Show or hide the elements based on the selected "Sold by" option
            toggleVolumeWeightGroup();
        }
    };
    
    
    // Function to calculate Remaining Volume dynamically
    const calculateRemainingVolume = () => {
        if (inStockInput && volumeWeightInput && remainingVolumeOutput) {
            const inStock = parseFloat(inStockInput.value) || 0;
            const volumeWeight = parseFloat(volumeWeightInput.value) || 0;
            const remainingVolume = Math.max(inStock * volumeWeight, 0);
            remainingVolumeOutput.value = remainingVolume.toFixed(2);
        }
    };

    // Add input listeners to trigger dynamic calculation
    inStockInput.addEventListener("input", calculateRemainingVolume);
    volumeWeightInput.addEventListener("input", calculateRemainingVolume);

    // Add event listeners for Sold By radio buttons
    soldByEach.addEventListener("change", toggleVolumeWeightGroup);
    soldByVolumeWeight.addEventListener("change", toggleVolumeWeightGroup);

    // Add event listener for Composite Item checkbox
    compositeItemCheckbox.addEventListener("change", () => {
        toggleCompositeItemTable();
        toggleSoldByOptions(); // Update radio button states when composite toggle changes
    });

    // Function to update Total Cost based on Composite Items
    const updateTotalCost = () => {
        const rows = compositeItemTable.querySelectorAll("tbody tr");
        let totalCost = 0;

        rows.forEach((row) => {
            const quantityInput = row.querySelector(".quantity-input");
            const itemCost = parseFloat(quantityInput.dataset.cost) || 0;
            const quantity = parseInt(quantityInput.value, 10) || 0;
            totalCost += quantity * itemCost;
        });

        totalCostLabel.textContent = totalCost.toFixed(2); // Update Total Cost label

        if (compositeItemCheckbox.checked) {
            costInput.value = totalCost.toFixed(2); // Reflect in cost input
        }
    };
    
    // Add event listener to dynamically calculate costs in Composite Table
    if (compositeItemTable) {
        compositeItemTable.addEventListener("keydown", (e) => {
            // Check if the target is a quantity input field
            const quantityInput = e.target.closest(".quantity-input");
            if (quantityInput && e.key === "Enter") {
                e.preventDefault(); // Prevent Enter from clearing the input field

                // Optionally, move to the next input field in the row (if desired)
                const nextInput = quantityInput.closest("tr").nextElementSibling?.querySelector(".quantity-input");
                if (nextInput) {
                    nextInput.focus(); // Move focus to the next row's quantity input
                }
            }
        });
    }

    // Initial visibility setup
    toggleVolumeWeightGroup();
    toggleCompositeItemTable();
    toggleSoldByOptions(); // Ensure radio buttons are updated on page load
    
    const monitorZeroQuantities = () => {
        const quantityInputs = compositeItemTable.querySelectorAll(".quantity-input");
    
        quantityInputs.forEach((input) => {
            input.addEventListener("input", () => {
                const quantity = parseInt(input.value, 10) || 0;
    
                if (quantity === 0) {
                    input.classList.add("quantity-zero"); // Add red styling class
                } else {
                    input.classList.remove("quantity-zero"); // Remove red styling class
                }
            });
    
            // Trigger input event to apply the initial style when table is loaded
            input.dispatchEvent(new Event("input"));
        });
    };

    // Function to add items to the composite table
    const addItemToTable = (item) => {
        const tableBody = compositeItemTable.querySelector("tbody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${item.name}</td>
            <td>
                <input type="number" class="quantity-input" min="0" value="0" data-cost="${item.cost}" />
            </td>
            <td class="dynamic-cost">₱0.00</td>
            <td><button class="btn remove-item"><img src="/static/images/ICON_DELETE.png" alt="Remove" /></button></td>
        `;

        tableBody.appendChild(newRow);

        // Add event listener for the remove button
        newRow.querySelector(".remove-item").addEventListener("click", () => {
            newRow.remove();
            addedItems = addedItems.filter((name) => name !== item.name); // Remove item from addedItems array
            updateTotalCost(); // Update total cost on remove
        });

        monitorZeroQuantities();

        // Add event listener for quantity input to update cost dynamically
        const quantityInput = newRow.querySelector(".quantity-input");
        const dynamicCostCell = newRow.querySelector(".dynamic-cost");

        quantityInput.addEventListener("input", () => {
            const quantity = parseInt(quantityInput.value, 10) || 0;
            const cost = parseFloat(quantityInput.dataset.cost) || 0;
            
            dynamicCostCell.textContent = `₱${(quantity * cost).toFixed(2)}`;
            updateTotalCost(); // Update total cost on quantity change
        });

        monitorZeroQuantities();
        
        // Add item name to addedItems to avoid showing it again in the search bar
        addedItems.push(item.name);
    };

    monitorZeroQuantities();

    // Fetch search results or all items
    const fetchSearchResults = async (query = "") => {
        try {
            console.log("Fetching items with query:", query); // Debugging
            const url = `/item-list/search-items/?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("Fetched results:", data.results); // Debugging

            searchResults.innerHTML = ""; // Clear previous results

            if (data.results.length > 0) {
                data.results.forEach((item) => {
                    // Only show items that are not already added to the composite table
                    if (!addedItems.includes(item.name)) {
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("dropdown-item");
                        resultItem.innerHTML = `
                            <strong>${item.name}</strong> - Cost: ₱${item.cost}
                        `;
                        resultItem.addEventListener("click", () => {
                            addItemToTable(item);
                            searchInput.value = ""; // Clear the search bar
                            searchResults.style.display = "none"; // Hide the dropdown
                        });
                        searchResults.appendChild(resultItem);
                    }
                });
                searchResults.style.display = "block"; // Show the dropdown
            } else {
                const noResultsItem = document.createElement("div");
                noResultsItem.classList.add("dropdown-item", "text-muted");
                noResultsItem.textContent = "No items found.";
                searchResults.appendChild(noResultsItem);

                searchResults.style.display = "block"; // Show the dropdown even if empty
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Show dropdown when search bar gains focus
    searchInput.addEventListener("focus", async () => {
        await fetchSearchResults(""); // Fetch all items (empty query)
        searchResults.style.display = "block"; // Force dropdown visibility
    });
    
    searchInput.addEventListener("mouseover", async () => {
        await fetchSearchResults(""); // Fetch all items (empty query)
        searchResults.style.display = "block"; // Force dropdown visibility
    });

    // Fetch specific results when typing in the search bar
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        fetchSearchResults(query);
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const highlightedItem = searchResults.querySelector(".highlight"); // Adjust based on your dropdown highlighting logic
            if (highlightedItem) {
                // Simulate a click on the highlighted item to add it to the composite item table
                highlightedItem.click();
            } else {
                event.preventDefault(); // Prevent form submission if no item is selected
            }
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = "none";
        }
    });
});
