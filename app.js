const $ = (id) => document.getElementById(id);
let currentCheckoutItem = null; 

// --- DUMMY DATA FOR DEMO ---
let mainCategories = [
    { id: "c1", name: "Shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=150" },
    { id: "c2", name: "Combos", image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=150" },
    { id: "c3", name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=150" }
];

let homeBanners = [
    { image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600" },
    { image: "https://images.unsplash.com/photo-1489987707023-afc82478168d?w=600" }
];

let products = [
    { id: "p1", name: "Premium Casual Men's Shirt", price: 899, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400" },
    { id: "p2", name: "Gen-Z Oversized T-Shirt Combo", price: 1299, image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400" },
    { id: "p3", name: "Luxury Baggy Denim Jeans", price: 1499, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: "p4", name: "Classic Polo T-Shirt", price: 699, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400" }
];
// -----------------------------

window.addEventListener("DOMContentLoaded", () => {
    $("splash").classList.add("hidden");
    $("app").classList.remove("hidden");
    renderHomeBanners();
    renderCategoryBubbles();
    renderHomeProducts();
});

window.switchNav = function(tab) {
    ["homeContent", "searchPage", "newPage", "likesPage", "orderPage"].forEach(id => {
        if($(id)) $(id).classList.add("hidden");
    });
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    if(tab === 'Home') $("homeContent").classList.remove("hidden");
    if(tab === 'Search') $("searchPage").classList.remove("hidden");
    if(tab === 'New') $("newPage").classList.remove("hidden");
    if(tab === 'Likes') $("likesPage").classList.remove("hidden");
    if(tab === 'Order') $("orderPage").classList.remove("hidden");
};

function renderHomeBanners() {
    const slider = $("homeBannersSlider");
    $("homeBannersWrap").classList.remove("hidden");
    homeBanners.forEach(b => {
        const div = document.createElement("div"); div.className = "banner-slide";
        div.innerHTML = `<img src="${b.image}" />`; slider.appendChild(div);
    });
}

function renderCategoryBubbles() {
    const wrap = $("imageCategoryWrap");
    wrap.classList.remove("hidden");
    mainCategories.forEach(cat => {
        const box = document.createElement("div"); box.className = "img-cat-box";
        box.innerHTML = `<img src="${cat.image}"><div>${cat.name}</div>`;
        wrap.appendChild(box);
    });
}

function renderHomeProducts() {
    const grid = $("products");
    products.forEach((p) => {
        const el = document.createElement("div"); el.className = "product";
        el.innerHTML = `
            <img src="${p.image}" />
            <div class="name">${p.name}</div>
            <div class="price">₹${p.price}</div>
            <button class="btn-primary" onclick="openProductDetail('${p.id}')">Buy Now</button>
        `;
        grid.appendChild(el);
    });
}

window.openProductDetail = function(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    $("pdName").textContent = p.name;
    $("pdPrice").textContent = "₹" + p.price;
    $("pdImageSlider").innerHTML = `<img src="${p.image}" />`;
    $("prodDetail").classList.remove("hidden");
    
    $("pdBuyNow").onclick = () => {
        currentCheckoutItem = p;
        $("prodDetail").classList.add("hidden");
        $("checkoutOverlay").classList.remove("hidden");
        $("checkoutStep1").classList.remove("hidden");
        $("checkoutStep2").classList.add("hidden");
        $("checkoutStep3").classList.add("hidden");
    };
}

$("pdBackBtn").onclick = () => $("prodDetail").classList.add("hidden");
$("closeCheckout").onclick = () => $("checkoutOverlay").classList.add("hidden");

$("step1NextBtn").onclick = () => {
    $("checkoutStep1").classList.add("hidden");
    $("checkoutStep2").classList.remove("hidden");
    $("step1NextBtn").classList.add("hidden");
    $("confirmOrderBtn").classList.remove("hidden");
};

$("confirmOrderBtn").onclick = () => {
    $("checkoutStep2").classList.add("hidden");
    $("checkoutStep3").classList.remove("hidden");
    $("checkoutFooter").classList.add("hidden");
};

$("successCloseBtn").onclick = () => {
    $("checkoutOverlay").classList.add("hidden");
};

// WhatsApp Help Button Logic
$("waScreenshotBtn").onclick = () => {
    let message = `Hello Unique Fashion! Mujhe is product ke baare mein thodi help chahiye.`;
    // Replace 1234567890 with your actual shop contact number
    let waUrl = `https://wa.me/911234567890?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
};
