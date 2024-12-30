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
        if (name) {
            fetch(`/item-list/check-item-name/?name=${encodeURIComponent(name)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        nameErrorLabel.textContent = "This name already exists.";
                        nameErrorLabel.style.display = "inline";
                        itemNameInput.classList.add("input-error"); // Optional: Add error styling
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
    
        requiredFields.forEach((field) => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add("error"); // Add error class for visual indication
            } else {
                field.classList.remove("error"); // Remove error class if field is valid
            }
        });
    
        if (!isValid) {
            alert("Please fill out all required fields before saving."); // Alert the user
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

    
    if (saveButton) {
        saveButton.addEventListener("click", (e) => {
            // Step 1: Validate required fields before proceeding
            if (!validateRequiredFields()) {
                e.preventDefault(); // Prevent form submission if validation fails
                return;
            }
            
            // Step 2: Check name validation
            if (!isNameValid()) {
                e.preventDefault();
                alert("The item name is invalid or already exists. Please fix it before saving.");
                return;
            }

            // Step 3: Check quantity validation
            if (!areQuantitiesValid()) {
                e.preventDefault();
                alert("Some quantities are zero. Please correct them before saving.");
                return;
            }

            // Step 2: If composite item toggle is checked, proceed with collecting composite item data
            if (compositeToggle.checked) {
                e.preventDefault(); // Prevent default form submission
                
                const compositeItemsData = collectCompositeItemData(); // Collect composite item data
                console.log("Composite Items Data:", compositeItemsData);
    
                const form = document.querySelector("form");
    
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

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            // Retrieve page and rows from button's data attributes
            const page = cancelButton.getAttribute("data-page") || 1;
            const rows = cancelButton.getAttribute("data-rows") || 10;

            // Construct the URL for redirection
            const redirectUrl = `/item-list/?page=${page}&rows=${rows}`;

            // Perform the redirection
            window.location.href = redirectUrl;
        });
    }
    
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
    compositeItemCheckbox.addEventListener("change", toggleCompositeItemTable);

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
            const url = `/item-list/search-items/?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();

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
                searchResults.style.display = "none"; // Hide if no results
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Show dropdown when search bar gains focus
    searchInput.addEventListener("focus", () => {
        fetchSearchResults(); // Fetch all items
    });

    // Fetch specific results when typing in the search bar
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        fetchSearchResults(query);
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = "none";
        }
    });
});
