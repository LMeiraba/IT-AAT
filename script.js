// --- 1. GLOBAL DATA (The "Database") ---
const menuItems = [
    { id: 1, name: "Grilled Salmon", price: 24.00, cat: "main", img: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=500" },
    { id: 2, name: "Bruschetta", price: 8.50, cat: "starter", img: "https://images.unsplash.com/photo-1572695157363-bc31c5ddf3aa?w=500" },
    { id: 3, name: "Lava Cake", price: 9.50, cat: "dessert", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500" },
    { id: 4, name: "Steak Frites", price: 29.00, cat: "main", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500" },
    { id: 5, name: "Caesar Salad", price: 12.00, cat: "starter", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500" },
    { id: 6, name: "Berry Cheesecake", price: 8.00, cat: "dessert", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500" }
];

// --- 2. INITIALIZATION (Runs when page loads) ---
document.addEventListener("DOMContentLoaded", () => {
    
    // A. Handle Loading Screen
    const loader = document.getElementById("loader-wrapper");
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => { loader.style.display = "none"; }, 500);
        }, 800);
    }

    // B. Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active"); // For rotation effect
            
            const icon = hamburger.querySelector("i");
            if(icon.classList.contains("fa-bars")){
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    }

    // C. Initialize Cart Badge
    updateCartBadge();
});

// --- 3. CART SYSTEM (Cookie Based) ---

// Helper: Get Cart from Cookie
function getCart() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('chakhaoCart='));
    if (cookie) {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    }
    return [];
}

// Helper: Save Cart to Cookie
function saveCart(cart) {
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = "chakhaoCart=" + encodeURIComponent(JSON.stringify(cart)) + ";" + expires + ";path=/";
    
    updateCartBadge();
}

// Update the little number on the nav bar
function updateCartBadge() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.querySelector(".cart-badge");
    if (badge) {
        badge.innerText = totalQty;
        badge.style.transform = "scale(1.2)";
        setTimeout(() => badge.style.transform = "scale(1)", 200);
    }
}

// Add Item (to be used in menu.html)
function addToCart(id) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id: id, qty: 1 });
    }

    saveCart(cart);
    alert("Delicious! Item added to cart."); 
}