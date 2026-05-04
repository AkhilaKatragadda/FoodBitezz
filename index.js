const API_URL = "https://dummyjson.com/recipes";

let cart = {};
let allRecipes = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// FETCH DATA
function placeOrder() {
    if (Object.keys(cart).length === 0) {
        alert("Cart is empty!");
        return;
    }

    const order = {
        items: { ...cart },
        date: new Date().toLocaleString()
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = {};
    updateCart();
    renderRecipes(allRecipes);

    alert("Order placed successfully!");
}
async function fetchRecipes() {
    const res = await fetch(API_URL);
    const data = await res.json();

    allRecipes = data.recipes;
    renderRecipes(allRecipes);
}

// RENDER RECIPES
function renderRecipes(recipes) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    recipes.forEach(item => {
        const qty = cart[item.name] || 0;
        const isFav = wishlist.includes(item.name);

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
        <div class="img-box">
          <img src="${item.image}">
          <span class="wishlist-icon" onclick="toggleWishlist('${item.name}')">
            ${isFav ? "❤️" : "🤍"}
          </span>
        </div>

        <h3>${item.name}</h3>
        <p>${item.cuisine}</p>

        ${qty === 0
            ? `<button onclick="addToCart('${item.name}')">Add</button>`
            : `
              <div class="qty-box">
                <button onclick="decreaseQty('${item.name}')">-</button>
                <span>${qty}</span>
                <button onclick="increaseQty('${item.name}')">+</button>
              </div>
            `
        }
        `;

        container.appendChild(div);
    });
}

function toggleWishlist(name) {
    if (wishlist.includes(name)) {
        wishlist = wishlist.filter(item => item !== name);
    } else {
        wishlist.push(name);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderRecipes(allRecipes);
}

// ADD TO CART
function addToCart(name, price) {
    cart[name] = 1;
    updateCart();
    renderRecipes(allRecipes);
}

function increaseQty(name, price) {
    cart[name]++;
    updateCart();
    renderRecipes(allRecipes);
}

function decreaseQty(name) {
    cart[name]--;

    if (cart[name] <= 0) {
        delete cart[name];
    }

    updateCart();
    renderRecipes(allRecipes);
}
// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    const count = document.getElementById("cartCount");

    cartItems.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    for (let name in cart) {
        const qty = cart[name];
        const price = 100; // (you can improve later)

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
      <p>${name}</p>

      <div class="cart-controls">
        <button onclick="decreaseQty('${name}')">-</button>
        <span>${qty}</span>
        <button onclick="increaseQty('${name}', ${price})">+</button>
      </div>

      <p>₹${qty * price}</p>
    `;

        cartItems.appendChild(div);

        total += qty * price;
        itemCount += qty;
    }

    totalEl.innerText = total;
    count.innerText = itemCount;
}

// TOGGLE CART
function toggleCart() {
    const cart = document.getElementById("cart");

    if (cart.classList.contains("show")) {
        cart.classList.remove("show");  
    } else {
        cart.classList.add("show");     
    }
}

document.addEventListener("click", function (e) {
    const cart = document.getElementById("cart");

    if (!cart.contains(e.target) && !e.target.closest("header button")) {
        cart.classList.remove("show");
    }
});

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = allRecipes.filter(item =>
        item.name.toLowerCase().includes(value)
    );

    renderRecipes(filtered);
});

function donate() {
    alert("Thank you for your support ❤️");
}

function showOrders() {
    const container = document.getElementById("orderHistory");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    orders.forEach((order, index) => {
        const div = document.createElement("div");
        div.className = "order-card";

        let itemsList = "";

        for (let item in order.items) {
            itemsList += `<p>${item} x${order.items[item]}</p>`;
        }

        div.innerHTML = `
      <h3>Order ${index + 1}</h3>
      <p>${order.date}</p>
      ${itemsList}
    `;

        container.appendChild(div);
    });
}

fetchRecipes();