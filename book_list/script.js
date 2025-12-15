// Google Books API Endpoint
const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const bookList = document.getElementById("book-list");
const categoryTitle = document.getElementById("category-title");

// Function to fetch books from API
async function fetchBooks(query) {
    bookList.innerHTML = '<p class="loading">Loading books...</p>';
    
    try {
        const response = await fetch(`${API_URL}${query}&maxResults=20`);
        const data = await response.json();

        if (data.items) {
            displayBooks(data.items);
            categoryTitle.innerText = `Results for "${query.replace('subject:', '')}"`;
        } else {
            bookList.innerHTML = '<p>No books found. Try a different search.</p>';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        bookList.innerHTML = '<p>Failed to load books. Please try again later.</p>';
    }
}

// Function to display books in the DOM
function displayBooks(books) {
    bookList.innerHTML = ""; // Clear previous results

    books.forEach(book => {
        const info = book.volumeInfo;
        const saleInfo = book.saleInfo;
        
        // Handle missing images
        const image = info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/150x200?text=No+Cover';
        
        // Handle missing authors
        const authors = info.authors ? info.authors.join(", ") : "Unknown Author";

        // Handle price (Google Books often returns price, but not always)
        let price = "Not for sale";
        if (saleInfo.saleability === "FOR_SALE" && saleInfo.listPrice) {
            price = `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}`;
        }

        // Create Book Card HTML
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            <img src="${image}" alt="${info.title}">
            <div class="book-info">
                <h3 class="book-title">${info.title}</h3>
                <p class="book-author">by ${authors}</p>
                <p class="book-price">${price}</p>
                <a href="${info.previewLink}" target="_blank" style="margin-top:10px; display:block; text-decoration:none; color:#3498db; font-size:0.9rem;">Preview Book</a>
            </div>
        `;

        bookList.appendChild(bookCard);
    });
}

// Search functionality
function searchBooks() {
    const query = document.getElementById("search-box").value;
    if (query) {
        fetchBooks(query);
    }
}

// Load default books on startup
window.onload = () => {
    fetchBooks("subject:programming");
};