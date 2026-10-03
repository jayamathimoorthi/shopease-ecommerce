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


// ============================
// SHOP NOW
// ============================

function scrollToProducts() {
  const section = document.getElementById("products");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}


// ============================
// LOAD PRODUCTS
// ============================

async function loadProducts() {

  productGrid.innerHTML = `
    <p>Loading products...</p>
  `;

  try {

    const response = await fetch(
      "https://dummyjson.com/products?limit=0"
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    products = data.products || [];

    displayProducts(products);

  } catch (error) {

    console.error(error);

    productGrid.innerHTML = `
      <div class="product-card">
        <h3>Unable to load products</h3>
        <p>Please check your internet connection.</p>
        <button onclick="loadProducts()">
          Try Again
        </button>
      </div>
    `;
  }
}


// ============================
// DISPLAY PRODUCTS
// ============================

function displayProducts(items) {

  productGrid.innerHTML = "";

  if (!items || items.length === 0) {

    productGrid.innerHTML = `
      <p>No products found.</p>
    `;

    return;
  }

  items.forEach(function(product) {

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


// ============================
// FILTER PRODUCTS
// ============================

function applyFilters() {

  const searchText =
    searchInput.value.toLowerCase().trim();

  const selectedCategory =
    categorySelect.value;

  let result = products.filter(function(product) {

    const title =
      String(product.title).toLowerCase();

    const category =
      String(product.category).toLowerCase();

    const searchMatch =
      title.includes(searchText);

    const categoryMatch =
      selectedCategory === "all" ||
      category === selectedCategory;

    return searchMatch && categoryMatch;

  });


  // SORT

  if (sortSelect.value === "low") {

    result.sort(function(a, b) {
      return a.price - b.price;
    });

  }

  else if (sortSelect.value === "high") {

    result.sort(function(a, b) {
      return b.price - a.price;
    });

  }

  else if (sortSelect.value === "name") {

    result.sort(function(a, b) {
      return a.title.localeCompare(b.title);
    });

  }


  displayProducts(result);
}


// ============================
// ADD TO CART
// ============================

function addToCart(productId) {

  const product =
    products.find(function(item) {
      return item.id === productId;
    });

  if (!product) {
    return;
  }

  cart.push(product);

  saveCart();

  updateCart();

  alert("Product added to cart! 🛒");
}


// ============================
// REMOVE FROM CART
// ============================

function removeFromCart(index) {

  cart.splice(index, 1);

  saveCart();

  updateCart();
}


// ============================
// SAVE CART
// ============================

function saveCart() {

  localStorage.setItem(
    "shopease-cart",
    JSON.stringify(cart)
  );
}


// ============================
// UPDATE CART
// ============================

function updateCart() {

  cartCount.textContent = cart.length;

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p>Your cart is empty.</p>
    `;

    cartTotal.textContent = "0";

    return;
  }

  let total = 0;

  cart.forEach(function(product, index) {

    total += Number(product.price);

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


// ============================
// LOGIN
// ============================

function openLogin() {

  loginModal.style.display = "flex";

}


function closeLogin() {

  loginModal.style.display = "none";

}


function loginUser() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();


  if (email === "" || password === "") {

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


// ============================
// CHECKOUT
// ============================

function checkout() {

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


// ============================
// EVENT LISTENERS
// ============================

if (searchInput) {

  searchInput.addEventListener(
    "input",
    applyFilters
  );

}


if (categorySelect) {

  categorySelect.addEventListener(
    "change",
    applyFilters
  );

}


if (sortSelect) {

  sortSelect.addEventListener(
    "change",
    applyFilters
  );

}


if (loginBtn) {

  loginBtn.addEventListener(
    "click",
    openLogin
  );

}


if (closeModal) {

  closeModal.addEventListener(
    "click",
    closeLogin
  );

}


if (submitLogin) {

  submitLogin.addEventListener(
    "click",
    loginUser
  );

}


window.addEventListener(
  "click",
  function(event) {

    if (event.target === loginModal) {
      closeLogin();
    }

  }
);


const checkoutButton =
  document.getElementById("checkout-btn");

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    checkout
  );

}


// ============================
// START APPLICATION
// ============================

loadProducts();

updateCart();
