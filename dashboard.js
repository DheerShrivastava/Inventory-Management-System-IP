// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// Set username
document.getElementById('username').textContent = localStorage.getItem('username');

// Navigation
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all sections
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked section
        this.classList.add('active');
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
});

// Inventory Management
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Add/Update Product
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const price = parseFloat(document.getElementById('productPrice').value);
    
    // Check if product exists
    const existingProduct = inventory.find(item => item.name === productName);
    
    if (existingProduct) {
        // Update existing product
        existingProduct.quantity = quantity;
        existingProduct.price = price;
    } else {
        // Add new product
        inventory.push({
            name: productName,
            quantity: quantity,
            price: price,
            sales: 0
        });
    }
    
    // Save to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Update UI
    updateInventoryList();
    updateProductSelect();
    
    // Reset form
    this.reset();
});

// Update Inventory List
function updateInventoryList() {
    const tbody = document.getElementById('inventoryList');
    tbody.innerHTML = '';
    
    inventory.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>
                <button class="sell" onclick="sellProduct(${index})">Sell</button>
                <button class="delete" onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Sell Product
function sellProduct(index) {
    if (inventory[index].quantity > 0) {
        inventory[index].quantity--;
        inventory[index].sales++;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryList();
        updateProductSelect();
    } else {
        alert('Product out of stock!');
    }
}

// Delete Product
function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryList();
        updateProductSelect();
    }
}

// Update Product Select for Analysis
function updateProductSelect() {
    const select = document.getElementById('productSelect');
    select.innerHTML = '<option value="">Select a Product</option>';
    
    inventory.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// Product Analysis
document.getElementById('productSelect').addEventListener('change', function() {
    const productName = this.value;
    const product = inventory.find(item => item.name === productName);
    const resultsDiv = document.getElementById('analysisResults');
    
    if (product) {
        resultsDiv.innerHTML = `
            <div class="analysis-header">
                <h3>${product.name} Analysis</h3>
            </div>
            <div class="analysis-card">
                <h4>Current Stock Level</h4>
                <p>${product.quantity}</p>
                <div class="trend ${product.quantity > 0 ? 'up' : 'down'}">
                    ${product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
            <div class="analysis-card">
                <h4>Price</h4>
                <p>₹${product.price.toFixed(2)}</p>
            </div>
            <div class="analysis-card">
                <h4>Total Sales</h4>
                <p>${product.sales}</p>
            </div>
            <div class="analysis-card">
                <h4>Total Revenue</h4>
                <p>₹${(product.sales * product.price).toFixed(2)}</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px;">
                <p style="color: var(--text-light);">Select a product to view analysis</p>
            </div>
        `;
    }
});

// Initialize
updateInventoryList();
updateProductSelect(); 