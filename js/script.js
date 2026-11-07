/* =========================================================
   Perfume Paradise - Main JavaScript
   Cart, Rendering, Filtering, Checkout (localStorage based)
   ========================================================= */

/* ---------------- Cart Storage ---------------- */
const CART_KEY = "pp_cart";
const WISH_KEY = "pp_wishlist";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
}

function saveWishlist(list) {
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  if (item) {
    item.qty = Math.min(item.qty + qty, product.stock);
  } else {
    cart.push({ id, qty: Math.min(qty, product.stock) });
  }
  saveCart(cart);
  showToast(`${product.name} cart mein add ho gaya`);
}

function removeFromCart(id) {
  saveCart(getCart().filter((c) => c.id !== id));
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = Math.min(qty, product.stock);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, c) => {
    const p = PRODUCTS.find((x) => x.id === c.id);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-count");
  badges.forEach((b) => {
    const n = cartCount();
    b.textContent = n;
    b.style.display = n > 0 ? "flex" : "none";
  });
}

/* ---------------- Toast ---------------- */
function showToast(message, icon = "✓") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container position-fixed top-0 end-0 p-3";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast app-toast align-items-center";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="toast-body"><span class="text-gold">${icon}</span> ${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>`;
  container.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 2400 });
  bsToast.show();
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
}

/* ---------------- Product Card ---------------- */
function productCard(p) {
  const wish = getWishlist().includes(p.id);
  return `
  <div class="col-sm-6 col-lg-3 mb-4">
    <div class="product-card">
      ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ""}
      <button class="wishlist-btn ${wish ? "active" : ""}" onclick="toggleWish(${p.id}, this)"
              title="Wishlist">${wish ? "♥" : "♡"}</button>
      <div class="product-img-wrap">${productImage(p)}</div>
      <div class="product-body">
        <div class="product-brand">${p.brand}</div>
        <h5 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h5>
        <div class="rating mb-1">${starMarkup(p.rating)} <small>(${p.reviews})</small></div>
        <p class="product-desc">${p.desc}</p>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="product-price">${formatPrice(p.price)}
            <span class="old-price">${formatPrice(p.oldPrice)}</span></div>
        </div>
        <button class="btn btn-dark-soft btn-add-cart" onclick="addToCart(${p.id})">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  </div>`;
}

function toggleWish(id, btn) {
  let list = getWishlist();
  const product = PRODUCTS.find((p) => p.id === id);
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
    btn.classList.remove("active");
    btn.textContent = "♡";
    showToast(`${product.name} wishlist se hata diya`, "♡");
  } else {
    list.push(id);
    btn.classList.add("active");
    btn.textContent = "♥";
    showToast(`${product.name} wishlist mein save ho gaya`, "♥");
  }
  saveWishlist(list);
}

/* ---------------- HOME PAGE ---------------- */
function initHome() {
  const featured = document.getElementById("featuredGrid");
  if (featured) {
    featured.innerHTML = PRODUCTS.slice(0, 8).map(productCard).join("");
  }

  // Hero bottle (real photo, SVG fallback)
  const heroBottle = document.getElementById("heroBottle");
  if (heroBottle)
    heroBottle.innerHTML = `<img src="images/hero.jpg" alt="Luxury perfume bottle"
      onerror="this.onerror=null;this.outerHTML=productImage(PRODUCTS[2])">`;

  // Stats counters
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const run = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(timer);
      }
      el.textContent = cur.toLocaleString("en-PK") + suffix;
    }, 20);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => obs.observe(c));
}

/* ---------------- SHOP / PRODUCTS PAGE ---------------- */
let filteredProducts = [...PRODUCTS];

function initShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  const cat = params.get("category");
  if (cat) {
    const box = document.querySelector(`input[name="category"][value="${cat}"]`);
    if (box) box.checked = true;
  }

  document.querySelectorAll("#filterArea input").forEach((inp) => {
    inp.addEventListener("change", applyFilters);
  });

  const searchInput = document.getElementById("shopSearch");
  if (searchInput) searchInput.addEventListener("input", applyFilters);

  const sortSelect = document.getElementById("sortBy");
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  const clearBtn = document.getElementById("clearFilters");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      document.querySelectorAll("#filterArea input").forEach((i) => (i.checked = false));
      document.querySelectorAll('input[type="range"]').forEach((r) => (r.value = r.max));
      const s = document.getElementById("shopSearch");
      if (s) s.value = "";
      const sel = document.getElementById("sortBy");
      if (sel) sel.value = "default";
      applyFilters();
      showToast("Saare filters clear ho gaye", "↺");
    });

  applyFilters();
}

function applyFilters() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const categories = [...document.querySelectorAll('input[name="category"]:checked')].map(
    (i) => i.value
  );
  const families = [...document.querySelectorAll('input[name="family"]:checked')].map(
    (i) => i.value
  );
  const maxPrice = +(document.getElementById("priceRange")?.value || 20000);
  const query = (document.getElementById("shopSearch")?.value || "").toLowerCase().trim();
  const sort = document.getElementById("sortBy")?.value || "default";

  filteredProducts = PRODUCTS.filter((p) => {
    if (categories.length && !categories.includes(p.category)) return false;
    if (families.length && !families.includes(p.family)) return false;
    if (p.price > maxPrice) return false;
    if (
      query &&
      !p.name.toLowerCase().includes(query) &&
      !p.brand.toLowerCase().includes(query) &&
      !p.family.toLowerCase().includes(query)
    )
      return false;
    return true;
  });

  if (sort === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") filteredProducts.sort((a, b) => b.price - a.price);
  if (sort === "rating") filteredProducts.sort((a, b) => b.rating - a.rating);
  if (sort === "name") filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  const count = document.getElementById("resultCount");
  if (count) count.textContent = filteredProducts.length;

  grid.innerHTML = filteredProducts.length
    ? filteredProducts.map(productCard).join("")
    : `<div class="col-12">
         <div class="empty-state">
           <div class="es-icon">🔍</div>
           <h4 class="mt-3">Koi perfume nahi mila</h4>
           <p class="text-muted">Filters change karke dobara try karein.</p>
         </div>
       </div>`;
}

/* ---------------- PRODUCT DETAIL PAGE ---------------- */
function initDetail() {
  const wrap = document.getElementById("detailWrap");
  if (!wrap) return;

  const id = +new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];

  document.title = `${p.name} - Perfume Paradise`;
  document.getElementById("breadcrumbName").textContent = p.name;
  document.getElementById("detailImage").innerHTML = productImage(p);
  document.getElementById("detailBrand").textContent = p.brand;
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailStars").innerHTML =
    starMarkup(p.rating) + ` <small class="text-muted">(${p.reviews} reviews)</small>`;
  document.getElementById("detailPrice").innerHTML =
    formatPrice(p.price) + ` <span class="old-price">${formatPrice(p.oldPrice)}</span>`;
  document.getElementById("detailDesc").textContent = p.desc;

  const badgeEl = document.getElementById("detailBadge");
  if (p.badge) {
    badgeEl.textContent = p.badge;
    badgeEl.classList.remove("d-none");
  }

  document.getElementById("infoSize").textContent = p.size;
  document.getElementById("infoFamily").textContent = p.family;
  document.getElementById("infoStock").textContent =
    p.stock > 0 ? `In Stock (${p.stock} pcs)` : "Out of Stock";
  document.getElementById("infoCategory").textContent =
    p.category.charAt(0).toUpperCase() + p.category.slice(1);

  document.getElementById("detailNotes").innerHTML = p.notes
    .map((n) => `<span class="badge bg-dark text-gold me-2 mb-2 px-3 py-2">${n}</span>`)
    .join("");

  const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  document.getElementById("detailDiscount").textContent = `-${discount}% OFF`;

  // Quantity
  let qty = 1;
  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyInput.value = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(p.stock, qty + 1);
    qtyInput.value = qty;
  });
  qtyInput.addEventListener("change", () => {
    qty = Math.min(p.stock, Math.max(1, +qtyInput.value || 1));
    qtyInput.value = qty;
  });

  document.getElementById("addBtn").addEventListener("click", () => addToCart(p.id, qty));
  document.getElementById("buyBtn").addEventListener("click", () => {
    addToCart(p.id, qty);
    location.href = "cart.html";
  });

  // Related products (same category, different id)
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const relGrid = document.getElementById("relatedGrid");
  if (relGrid) relGrid.innerHTML = related.map(productCard).join("");
}

/* ---------------- CART PAGE ---------------- */
function initCart() {
  const wrap = document.getElementById("cartWrap");
  if (!wrap) return;
  renderCart();
}

function renderCart() {
  const body = document.getElementById("cartBody");
  const summary = document.getElementById("cartSummary");
  const empty = document.getElementById("cartEmpty");
  const table = document.getElementById("cartTable");
  const cart = getCart();

  if (!cart.length) {
    empty.classList.remove("d-none");
    table.classList.add("d-none");
    summary.classList.add("d-none");
    body.innerHTML = "";
    return;
  }

  empty.classList.add("d-none");
  table.classList.remove("d-none");
  summary.classList.remove("d-none");

  body.innerHTML = cart
    .map((c) => {
      const p = PRODUCTS.find((x) => x.id === c.id);
      if (!p) return "";
      return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <div class="cart-item-img">${productImage(p)}</div>
            <div>
              <div class="product-brand">${p.brand}</div>
              <a href="product.html?id=${p.id}" class="link-plain fw-semibold">${p.name}</a>
              <div class="text-muted small">${p.size} · ${p.family}</div>
            </div>
          </div>
        </td>
        <td class="align-middle">${formatPrice(p.price)}</td>
        <td class="align-middle">
          <div class="input-group input-group-sm qty-box">
            <button class="btn btn-outline-secondary" onclick="changeQty(${p.id}, ${c.qty - 1})">−</button>
            <input class="form-control" value="${c.qty}" readonly>
            <button class="btn btn-outline-secondary" onclick="changeQty(${p.id}, ${c.qty + 1})">+</button>
          </div>
        </td>
        <td class="align-middle fw-bold">${formatPrice(p.price * c.qty)}</td>
        <td class="align-middle text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="changeQty(${p.id}, 0)" title="Remove">🗑</button>
        </td>
      </tr>`;
    })
    .join("");

  updateSummary();
}

function changeQty(id, qty) {
  updateQty(id, qty);
  renderCart();
  showToast("Cart update ho gaya", "🛒");
}

function updateSummary() {
  const sub = cartSubtotal();
  const shipping = sub >= 5000 || sub === 0 ? 0 : 250;
  const discount = sub >= 10000 ? Math.round(sub * 0.05) : 0;
  const total = sub + shipping - discount;

  document.getElementById("sumSub").textContent = formatPrice(sub);
  document.getElementById("sumShip").textContent =
    shipping === 0 ? (sub === 0 ? formatPrice(0) : "FREE") : formatPrice(shipping);
  document.getElementById("sumDiscount").textContent = discount
    ? "- " + formatPrice(discount)
    : formatPrice(0);
  document.getElementById("sumTotal").textContent = formatPrice(total);
}

function checkout() {
  const cart = getCart();
  if (!cart.length) return;
  const total = document.getElementById("sumTotal").textContent;

  document.getElementById("orderTotal").textContent = total;
  const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
  modal.show();

  document.getElementById("confirmOrder").onclick = () => {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();

    if (!name || !phone || !address) {
      showToast("Sabhi details bharna zaroori hai", "⚠");
      return;
    }

    const orderId = "PP-" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("pp_last_order", JSON.stringify({ orderId, name, total }));
    saveCart([]);
    modal.hide();
    document.getElementById("orderForm").reset();

    document.getElementById("orderIdOut").textContent = orderId;
    const successModal = new bootstrap.Modal(document.getElementById("successModal"));
    successModal.show();
  };
}

/* ---------------- NEWSLETTER ---------------- */
function subscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  showToast(`Shukriya! ${input.value} par offer code bhej diya gaya`, "✉");
  e.target.reset();
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initHome();
  initShop();
  initDetail();
  initCart();
});
