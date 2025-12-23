let globalMenu = [];
let currentCategory = 'all';


document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    //check which page is loaded
    if (document.getElementById('menu-grid')){
        setupMenuControls();
        renderMenu();
    };
    if (document.getElementById('cart-body')) renderCartPage();
    if (document.getElementById('team-grid')) {
        renderTeam()
        };
    setupUI();
    updateCartBadge();
});

// --- . DATA FETCHING ---
async function loadData() {
    try {
        const response = await fetch('data.json');//file in the same directory
        const data = await response.json();
        globalMenu = data.menu;
        globalTeam = data.staff;
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// --- . PAGE RENDERING FUNCTIONS ---

function setupMenuControls() {
    // 1. Category Buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat; // 'all', 'starter', etc.
            renderMenu();
        });
    });

    // 2. Search Input
    document.getElementById('searchInput').addEventListener('input', renderMenu);

    // 3. Sort Dropdown
    document.getElementById('sortSelect').addEventListener('change', renderMenu);

    // 4. Veg Toggle
    document.getElementById('vegCheckbox').addEventListener('change', renderMenu);
}

// --- menu RENDER FUNCTION --
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    // 1. Start with all items
    let items = [...globalMenu];

    // 2. Filter by Category
    if (currentCategory !== 'all') {
        items = items.filter(item => item.cat === currentCategory);
    }

    // 3. Filter by Search (Name)
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        items = items.filter(item => item.name.toLowerCase().includes(searchTerm));
    }

    // 4. Filter by Veg
    const vegOnly = document.getElementById('vegCheckbox').checked;
    if (vegOnly) {
        items = items.filter(item => item.veg === true);
    }

    // 5. Sorting Logic
    const sortValue = document.getElementById('sortSelect').value;
    if (sortValue === 'price-low') {
        items.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        items.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'alpha-asc') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 6. Generate HTML
    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:#777; font-size: 1.2rem;">No dishes found matching your criteria.</p>';
        return;
    }

    grid.innerHTML = items.map(item => {
        const vegIcon = item.veg ? '<span class="veg-icon veg">●</span>' : '<span class="veg-icon non-veg">●</span>';
        const bgStyle = item.bg ? `background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('${item.bg}'); background-size: cover;` : '';
        const longDesc = item.long_des || "Delicious authentic flavors.";

        //Calculate the correct button state (Add vs +/-) for this specific item
        const buttonHTML = getButtonHTML(item.id);
        // console.log(item);
        return `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
                
                <div class="flip-card-front" style="${bgStyle}">
                    <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                    <div class="food-info">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 10px;">
                            <h4 style="margin:0; font-family:'Playfair Display', serif; font-size: 1.2rem;">${item.name}</h4>
                            ${vegIcon}
                        </div>
                        <p style="font-size:0.9rem; color:#666; line-height: 1.4;">${item.desc}</p>
                        
                        <div class="price-row">
                            <span style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">₹${item?.price?.toFixed(2)}</span>
                            
                            <div id="btn-zone-${item.id}" class="btn-zone">
                                ${buttonHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flip-card-back">
                    <h3 style="color:var(--primary); margin-bottom:15px;">${item.name}</h3>
                    <p style="font-size:1rem; line-height:1.6;">${longDesc}</p>
                    <div class="flip-instruction" style="margin-top:20px; color:#ccc; font-size:0.8rem;">
                        <i class="fas fa-undo"></i> Click to flip back
                    </div>
                </div>

            </div>
        </div>
        `;
    }).join('');
}

// RENDER TEAM 
function renderTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    grid.innerHTML = globalTeam.map(member => {
        const joinYear = new Date(member.joined).getFullYear();
        const bgStyle = member.bg ? `background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('${member.bg}'); background-size: cover;` : '';
        const longDesc = member.long_des || member.about || "No additional details available.";

        return `
        <div class="flip-card" onclick="this.classList.toggle('flipped')" style="height: 450px;">
            <div class="flip-card-inner">
                
                <div class="flip-card-front" style="${bgStyle}; padding: 20px; text-align:center;">
                    <img src="${member.img}" alt="${member.name}" style="width:100%; aspect-ratio: 1 / 1; object-fit:cover; object-position: top; border-radius:10px; margin-bottom:15px;">
                    <h3 style="color:var(--primary); margin-bottom:5px;">${member.name}</h3>
                    <p style="font-weight:bold; color:var(--secondary); margin-bottom:5px;">${member.position}</p>
                    <p style="font-size:0.8rem; color:#888;">Joined in ${joinYear}</p>
                    <p style="font-size:0.9rem; color:#666;">${member.about}</p>
                </div>

                <div class="flip-card-back">
                    <h3>About ${member.name.split(' ')[0]}</h3>
                    <p>${longDesc}</p>
                    <div class="flip-instruction"><i class="fas fa-undo"></i> Click to flip back</div>
                </div>

            </div>
        </div>
        `;
    }).join('');
}

// --- 5. RENDER CART PAGE -
function renderCartPage() {
    const tbody = document.getElementById('cart-body');
    const subtotalEl = document.getElementById('subtotal-price');
    const taxEl = document.getElementById('tax-price');
    const totalEl = document.getElementById('grand-total');
    
    // Only run if we are on the cart page
    if (!tbody) return;

    const cart = getCart();

    // EMPTY STATE
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding: 50px;">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                    <p style="color: #777; font-size: 1.2rem;">Your cart is empty.</p>
                    <a href="menu.html" class="btn btn-primary" style="margin-top:15px; display:inline-block;">Browse Menu</a>
                </td>
            </tr>
        `;
        // Zero out the summary
        if(subtotalEl) subtotalEl.innerText = "₹0.00";
        if(taxEl) taxEl.innerText = "₹0.00";
        if(totalEl) totalEl.innerText = "₹0.00";
        return;
    }

    let subtotal = 0;

    // GENERATE ROWS
    tbody.innerHTML = cart.map(cartItem => {
        const product = globalMenu.find(p => p.id === cartItem.id);
        if (!product) return '';
        
        const rowTotal = product.price * cartItem.qty;
        subtotal += rowTotal;

        return `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/100?text=Food'">
                        <div>
                            <h4>${product.name}</h4>
                            <small style="color:#888;">${product.veg ? 'Veg' : 'Non-Veg'}</small>
                        </div>
                    </div>
                </td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>
                    <div class="table-qty">
                        <button onclick="changeQty(${product.id}, -1)">-</button>
                        <span>${cartItem.qty}</span>
                        <button onclick="changeQty(${product.id}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight:bold; color:var(--primary);">₹${rowTotal.toFixed(2)}</td>
                <td>
                    <button class="remove-link" onclick="removeFromCart(${product.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // CALCULATE BILL
    const tax = subtotal * 0.05; // 5% GST
    const grandTotal = subtotal + tax;

    // UPDATE SUMMARY
    if(subtotalEl) subtotalEl.innerText = "₹" + subtotal.toFixed(2);
    if(taxEl) taxEl.innerText = "₹" + tax.toFixed(2);
    if(totalEl) totalEl.innerText = "₹" + grandTotal.toFixed(2);
}

// CHECKOUT FUNCTION
function checkout() {
    const cart = getCart();
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // In a real app, this would go to a payment gateway.
    // Here we just simulate success.
    if(confirm("Confirm your order of ₹" + document.getElementById('grand-total').innerText.replace('₹','') + "?")) {
        // Clear Cart
        document.cookie = "chakhaoCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert("🎉 Order Placed Successfully! Your delicious food is on the way.");
        window.location.href = "index.html";
    }
}
// HELPER: Generate Button HTML based on Cart State
function getButtonHTML(id) {
    const cart = getCart();
    const itemInCart = cart.find(item => item.id === id);

    if (itemInCart) {
        // Show [ - QTY + ] Control
        return `
            <div class="card-qty-control" onclick="event.stopPropagation()">
                <button class="card-qty-btn" onclick="menuChangeQty(${id}, -1)">-</button>
                <span class="card-qty-display">${itemInCart.qty}</span>
                <button class="card-qty-btn" onclick="menuChangeQty(${id}, 1)">+</button>
            </div>
        `;
    } else {
        // Show [ ADD ] Button
        return `
            <button class="add-btn" onclick="event.stopPropagation(); menuAddItem(${id})">
                Add <i class="fas fa-shopping-basket"></i>
            </button>
        `;
    }
}
// ACTION: Add new item from Menu
function menuAddItem(id) {
    let cart = getCart();
    cart.push({ id: id, qty: 1 });
    saveCart(cart);
    refreshItemUI(id); // Update just this button
}

// ACTION: Change qty from Menu (+ or -)
function menuChangeQty(id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].qty += change;
        
        // Remove if qty reaches 0
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    saveCart(cart);
    refreshItemUI(id); // Update just this button
}

// UI UPDATE: Refresh only the button zone, prevent reloading the entire menu
function refreshItemUI(id) {
    const zone = document.getElementById(`btn-zone-${id}`);
    if (zone) {
        zone.innerHTML = getButtonHTML(id);
    }
}
// --- 5. CART LOGIC (Cookies) ---
function getCart() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('chakhaoCart='));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
}

function saveCart(cart) {
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));//save for 1 week
    document.cookie = `chakhaoCart=${encodeURIComponent(JSON.stringify(cart))}; expires=${d.toUTCString()}; path=/`;
    updateCartBadge();
}

function addToCart(id) {
    let cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: id, qty: 1 });
    saveCart(cart);
    alert("Item added to cart!");
}

function removeFromCart(id) {
    saveCart(getCart().filter(item => item.id !== id));
    renderCartPage();
}

function changeQty(id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
    renderCartPage();
}

function updateCartBadge() {
    const count = getCart().reduce((sum, item) => sum + item.qty, 0);
    const badge = document.querySelector(".cart-badge");
    if (badge) badge.innerText = count;
}

function setupUI() {
    const loader = document.getElementById("loader-wrapper");
    if(loader) setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.style.display = "none", 500); }, 800);

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }
}
