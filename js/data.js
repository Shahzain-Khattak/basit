/* =========================================================
   Perfume Paradise - Product Data + SVG Bottle Generator
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Noir Elegance",
    brand: "Maison Luxe",
    category: "men",
    family: "Woody",
    price: 8500,
    oldPrice: 10500,
    rating: 4.8,
    reviews: 214,
    badge: "Bestseller",
    stock: 18,
    size: "100 ml",
    colors: ["#2b2b34", "#6c6c80"],
    desc: "A deep, seductive blend of black pepper, leather and vetiver made for the modern gentleman.",
    notes: ["Black Pepper", "Leather", "Vetiver", "Amber"],
  },
  {
    id: 2,
    name: "Rose Velvet",
    brand: "Flora Paris",
    category: "women",
    family: "Floral",
    price: 9200,
    oldPrice: 11000,
    rating: 4.9,
    reviews: 341,
    badge: "New",
    stock: 12,
    size: "75 ml",
    colors: ["#b4485f", "#f0a8b8"],
    desc: "Bulgarian rose petals wrapped in soft vanilla and a whisper of pink peony.",
    notes: ["Rose", "Peony", "Vanilla", "Musk"],
  },
  {
    id: 3,
    name: "Oud Royal",
    brand: "Arabian Oud",
    category: "unisex",
    family: "Oriental",
    price: 14500,
    oldPrice: 16800,
    rating: 5.0,
    reviews: 178,
    badge: "Premium",
    stock: 7,
    size: "100 ml",
    colors: ["#4a2f14", "#c99b4a"],
    desc: "Rare Cambodian oud layered with saffron, incense and golden amber resin.",
    notes: ["Oud", "Saffron", "Incense", "Amber"],
  },
  {
    id: 4,
    name: "Aqua Breeze",
    brand: "Marine Co.",
    category: "men",
    family: "Fresh",
    price: 5600,
    oldPrice: 6800,
    rating: 4.5,
    reviews: 402,
    badge: "",
    stock: 30,
    size: "100 ml",
    colors: ["#1f6f8b", "#8fd6e8"],
    desc: "Ocean spray, sea salt and cool mint — a burst of pure coastal freshness.",
    notes: ["Sea Salt", "Mint", "Marine Notes", "Cedar"],
  },
  {
    id: 5,
    name: "Vanilla Dream",
    brand: "Sugar & Co.",
    category: "women",
    family: "Sweet",
    price: 6900,
    oldPrice: 8200,
    rating: 4.7,
    reviews: 265,
    badge: "Bestseller",
    stock: 22,
    size: "80 ml",
    colors: ["#c9a06a", "#f6e2c0"],
    desc: "Madagascar vanilla cream with caramel and a soft powdery dry down.",
    notes: ["Vanilla", "Caramel", "Tonka", "Musk"],
  },
  {
    id: 6,
    name: "Citrus Blast",
    brand: "Zest Studio",
    category: "unisex",
    family: "Citrus",
    price: 4800,
    oldPrice: 5900,
    rating: 4.4,
    reviews: 189,
    badge: "",
    stock: 40,
    size: "100 ml",
    colors: ["#d99a1a", "#ffe488"],
    desc: "Sicilian bergamot, lemon zest and grapefruit for an instant mood lift.",
    notes: ["Bergamot", "Lemon", "Grapefruit", "Neroli"],
  },
  {
    id: 7,
    name: "Amber Nights",
    brand: "Maison Luxe",
    category: "men",
    family: "Oriental",
    price: 11200,
    oldPrice: 13000,
    rating: 4.8,
    reviews: 156,
    badge: "Premium",
    stock: 9,
    size: "100 ml",
    colors: ["#6b3f16", "#e0a95c"],
    desc: "Warm amber, tobacco leaf and tonka bean for unforgettable evenings.",
    notes: ["Amber", "Tobacco", "Tonka", "Patchouli"],
  },
  {
    id: 8,
    name: "Jasmine Bloom",
    brand: "Flora Paris",
    category: "women",
    family: "Floral",
    price: 7400,
    oldPrice: 8900,
    rating: 4.6,
    reviews: 231,
    badge: "",
    stock: 16,
    size: "75 ml",
    colors: ["#7f9c4f", "#d7e8a5"],
    desc: "Night-blooming jasmine with green leaves and a clean white musk base.",
    notes: ["Jasmine", "Green Notes", "White Musk", "Lily"],
  },
  {
    id: 9,
    name: "Sandalwood Reserve",
    brand: "Wood & Ember",
    category: "unisex",
    family: "Woody",
    price: 12800,
    oldPrice: 14500,
    rating: 4.9,
    reviews: 143,
    badge: "New",
    stock: 6,
    size: "100 ml",
    colors: ["#8a6a4a", "#dcc3a1"],
    desc: "Creamy Mysore sandalwood smoothed with cardamom and cashmere wood.",
    notes: ["Sandalwood", "Cardamom", "Cashmere", "Musk"],
  },
  {
    id: 10,
    name: "Berry Spark",
    brand: "Sugar & Co.",
    category: "women",
    family: "Fruity",
    price: 5200,
    oldPrice: 6400,
    rating: 4.3,
    reviews: 298,
    badge: "",
    stock: 25,
    size: "80 ml",
    colors: ["#9b2c6b", "#ee87bd"],
    desc: "Wild raspberry, blackcurrant and a fizzy champagne accord.",
    notes: ["Raspberry", "Blackcurrant", "Champagne", "Vanilla"],
  },
  {
    id: 11,
    name: "Cedar Storm",
    brand: "Wood & Ember",
    category: "men",
    family: "Woody",
    price: 9800,
    oldPrice: 11500,
    rating: 4.7,
    reviews: 187,
    badge: "",
    stock: 14,
    size: "100 ml",
    colors: ["#3f4a3a", "#93a789"],
    desc: "Atlas cedar, stormy iris and smoked vetiver with a mineral finish.",
    notes: ["Cedar", "Iris", "Vetiver", "Smoke"],
  },
  {
    id: 12,
    name: "White Musk",
    brand: "Marine Co.",
    category: "unisex",
    family: "Fresh",
    price: 6300,
    oldPrice: 7500,
    rating: 4.6,
    reviews: 376,
    badge: "Bestseller",
    stock: 28,
    size: "100 ml",
    colors: ["#9aa3ad", "#eef1f4"],
    desc: "Clean white musk with cotton accord — soft, airy and effortlessly elegant.",
    notes: ["White Musk", "Cotton", "Aldehydes", "Amber"],
  },
];

/* Real product photos (local images folder) */
const PRODUCT_IMAGES = {
  1: "images/product-1.jpg",
  2: "images/product-2.jpg",
  3: "images/product-3.jpg",
  4: "images/product-4.jpg",
  5: "images/product-5.jpg",
  6: "images/product-6.jpg",
  7: "images/product-7.jpg",
  8: "images/product-8.jpg",
  9: "images/product-9.jpg",
  10: "images/product-10.jpg",
  11: "images/product-11.jpg",
  12: "images/product-12.jpg",
};

PRODUCTS.forEach((p) => (p.image = PRODUCT_IMAGES[p.id] || null));

/* Returns the real photo if available, otherwise the SVG bottle */
function productImage(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name} ${p.brand} perfume"
             loading="lazy" onerror="imageFallback(this, ${p.id})">`;
  }
  return productSVG(p);
}

function imageFallback(el, id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (p) el.outerHTML = productSVG(p);
}

/* Builds a unique SVG perfume bottle for each product (offline fallback) */
function productSVG(p) {
  const g1 = p.colors[0];
  const g2 = p.colors[1];
  const gid = "g" + p.id;
  const lid = "l" + p.id;

  return `
  <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${g1}"/>
        <stop offset="100%" stop-color="${g2}"/>
      </linearGradient>
      <linearGradient id="${lid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e7d9a8"/>
        <stop offset="50%" stop-color="#c9a227"/>
        <stop offset="100%" stop-color="#8a6f14"/>
      </linearGradient>
    </defs>
    <ellipse cx="150" cy="315" rx="88" ry="14" fill="rgba(0,0,0,0.12)"/>
    <rect x="128" y="34" width="44" height="46" rx="6" fill="url(#${lid})"/>
    <rect x="138" y="76" width="24" height="18" fill="#8a6f14"/>
    <path d="M78 108 h144 a24 24 0 0 1 24 24 v150 a26 26 0 0 1 -26 26 H80 a26 26 0 0 1 -26 -26 V132 a24 24 0 0 1 24 -24 z"
          fill="url(#${gid})"/>
    <path d="M78 108 h60 v200 H80 a26 26 0 0 1 -26 -26 V132 a24 24 0 0 1 24 -24 z"
          fill="rgba(255,255,255,0.18)"/>
    <rect x="92" y="150" width="116" height="96" rx="4" fill="rgba(255,255,255,0.86)"/>
    <text x="150" y="184" text-anchor="middle" font-family="Georgia, serif" font-size="17"
          fill="#141210" letter-spacing="1">${p.name.split(" ")[0]}</text>
    <line x1="112" y1="196" x2="188" y2="196" stroke="#c9a227" stroke-width="1.5"/>
    <text x="150" y="218" text-anchor="middle" font-family="Arial" font-size="10"
          fill="#7d766d" letter-spacing="3">${p.brand.toUpperCase()}</text>
    <text x="150" y="238" text-anchor="middle" font-family="Arial" font-size="9"
          fill="#a89b86" letter-spacing="2">${p.size}</text>
    <ellipse cx="150" cy="288" rx="46" ry="7" fill="rgba(255,255,255,0.22)"/>
  </svg>`;
}

/* Price helper */
function formatPrice(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

/* Star rating markup */
function starMarkup(rating) {
  const full = Math.round(rating);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= full ? "★" : "☆";
  }
  return html;
}
