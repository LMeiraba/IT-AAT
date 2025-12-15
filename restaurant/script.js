// Mock Data: Mimicking a database response
const menuItems = [
    {
        id: 1,
        title: "Crispy Calamari",
        category: "starter",
        price: "₹5600",
        desc: "Golden fried squid rings served with tangy tartar sauce and lemon wedges.",
        img: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Bruschetta",
        category: "starter",
        price: "₹850",
        desc: "Grilled sourdough bread topped with fresh tomatoes, basil, garlic, and olive oil.",
        img: "https://images.unsplash.com/photo-1572695157363-bc31c5ddf3aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Grilled Salmon",
        category: "main",
        price: "₹800",
        desc: "Fresh Atlantic salmon fillet served with roasted asparagus and quinoa.",
        img: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Classic Steak",
        category: "main",
        price: "₹500",
        desc: "Juicy ribeye steak cooked to perfection, served with mashed potatoes.",
        img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Chocolate Lava Cake",
        category: "dessert",
        price: "₹30",
        desc: "Warm chocolate cake with a gooey center, served with vanilla bean ice cream.",
        img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Cheesecake",
        category: "dessert",
        price: "₹599",
        desc: "New York style cheesecake topped with fresh strawberry compote.",
        img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Chicken Caesar Salad",
        category: "starter",
        price: "₹1200",
        desc: "Crisp romaine lettuce, parmesan cheese, croutons, and grilled chicken breast.",
        img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        title: "Vegetable Pasta",
        category: "main",
        price: "₹100",
        desc: "Penne pasta tossed in a rich tomato basil sauce with seasonal vegetables.",
        img: "https://images.unsplash.com/photo-1626844131082-256783844137?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const menuContainer = document.getElementById("menu-container");
const filterBtns = document.querySelectorAll(".filter-btn");

// Function to display menu items
function displayMenu(items) {
    let displayMenu = items.map(function (item) {
        return `<article class="food-card">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="food-info">
                        <div class="food-header">
                            <h4 class="food-title">${item.title}</h4>
                            <span class="food-price">${item.price}</span>
                        </div>
                        <p class="food-desc">${item.desc}</p>
                        <button class="btn-add">Order Now</button>
                    </div>
                </article>`;
    });
    
    displayMenu = displayMenu.join(""); // Join array into a single string
    menuContainer.innerHTML = displayMenu;
}

// Function to filter items
function filterMenu(category) {
    // 1. Update active button style
    filterBtns.forEach(function (btn) {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick").includes(category)) {
            btn.classList.add("active");
        }
    });

    // 2. Filter logic
    if (category === "all") {
        displayMenu(menuItems);
    } else {
        const filteredItems = menuItems.filter(function (item) {
            return item.category === category;
        });
        displayMenu(filteredItems);
    }
}

// Load all items when page loads
window.addEventListener("DOMContentLoaded", function () {
    displayMenu(menuItems);
});