let products = [];
let cart = JSON.parse(localStorage.getItem("shopease-cart")) || [];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const closeModal = document.getElementById("close-modal");
const submitLogin = document.getElementById("submit-login");
const loginMessage = document.getElementById("login-message");


// =========================
// Load Products
// =========================

async function loadProducts() {

  productGrid.innerHTML = "<p>Loading products...</p>";

  try {

    const response = await fetch(
      "https://dummyjson.com/products?limit=0"
    );

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();

    products = data.products;

    displayProducts(products);

  } catch (error) {

    productGrid.innerHTML = `
      <p>
        ⚠️ Unable to load products.
        Please check your internet connection.
      </p>
    `;

  }
}


// =========================
// Display Products
// =========================

function displayProducts(items) {

  productGrid.innerHTML = "";

  if (items.length === 0) {

    productGrid.innerHTML =
      "<p>No products found.</p>";

    return;
  }

  items.forEach(product => {

    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `
      <img
        src="${product.thumbnail}"
        alt="${product.title}"
      >

      <h3>${product.title}</h3>

      <p>
        Category: ${product.category}
      </p>

      <p class="price">
        ₹${product.price}
      </p>

      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    `;

    productGrid.appendChild(card);

  });
}


// =========================
// Search + Filter + Sort
// =========================

function applyFilters() {

  const searchText =
    searchInput.value.toLowerCase().trim();

  const category =
    categorySelect.value;

  let filtered = products.filter(product => {

    const matchesSearch =
      product.title
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;

  });


  // Sorting

  if (sortSelect.value === "low") {

    filtered.sort(
      (a, b) => a.price - b.price
    );

  }

  if (sortSelect.value === "high") {

    filtered.sort(
      (a, b) => b.price - a.price
    );

  }

  if (sortSelect.value === "name") {

    filtered.sort(
      (a, b) =>
        a.title.localeCompare(b.title)
    );

  }


  displayProducts(filtered);

}


// =========================
// Add To Cart
// =========================

function addToCart(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;

  cart.push(product);

  saveCart();

  updateCart();

  alert("Product added to cart! 🛒");

}


// =========================
// Save Cart
// =========================

function saveCart() {

  localStorage.setItem(
    "shopease-cart",
    JSON.stringify(cart)
  );

}


// =========================
// Update Cart
// =========================

function updateCart() {

  cartCount.textContent = cart.length;

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartItems.innerHTML =
      "<p>Your cart is empty.</p>";

    cartTotal.textContent = "0";

    return;
  }


  let total = 0;

  cart.forEach((product, index) => {

    total += product.price;

    const item =
      document.createElement("div");

    item.className = "cart-item";

    item.innerHTML = `
      <div>
        <strong>${product.title}</strong>
        <p>₹${product.price}</p>
      </div>

      <button onclick="removeFromCart(${index})">
        Remove
      </button>
    `;

    cartItems.appendChild(item);

  });

  cartTotal.textContent =
    total.toFixed(2);

}


// =========================
// Remove From Cart
// =========================

function removeFromCart(index) {

  cart.splice(index, 1);

  saveCart();

  updateCart();

}


// =========================
// Login Modal
// =========================

loginBtn.addEventListener(
  "click",
  () => {

    loginModal.style.display = "flex";

  }
);


closeModal.addEventListener(
  "click",
  () => {

    loginModal.style.display = "none";

  }
);


window.addEventListener(
  "click",
  (event) => {

    if (event.target === loginModal) {

      loginModal.style.display = "none";

    }

  }
);


// =========================
// Login Simulation
// =========================

submitLogin.addEventListener(
  "click",
  () => {

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;


    if (!email || !password) {

      loginMessage.textContent =
        "Please enter email and password.";

      return;
    }


    localStorage.setItem(
      "shopease-user",
      email
    );


    loginMessage.textContent =
      "Login successful! ✅";

    loginBtn.textContent =
      "Logged In";

  }
);


// =========================
// Checkout
// =========================

document
  .getElementById("checkout-btn")
  .addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
      }

      alert(
        "Order placed successfully! 🎉"
      );

      cart = [];

      saveCart();

      updateCart();

    }
  );


// =========================
// Events
// =========================

searchInput.addEventListener(
  "input",
  applyFilters
);

categorySelect.addEventListener(
  "change",
  applyFilters
);

sortSelect.addEventListener(
  "change",
  applyFilters
);


// =========================
// Shop Now
// =========================

function scrollToProducts() {

  document
    .getElementById("products")
    .scrollIntoView({
      behavior: "smooth"
    });

}


// =========================
// Start App
// =========================

loadProducts();

updateCart();
