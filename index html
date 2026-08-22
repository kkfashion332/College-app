import os
import json
import time
from flask import Flask, render_template_string, request, redirect, url_for, session
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
app.secret_key = "kk_fashion_super_secret_key_123"

# =========================================================
# 🔴 ORIGINAL FIRESTORE KEY (FIXED DICTIONARY FORMAT)
# =========================================================
FIREBASE_KEY_DICT = {
  "type": "service_account",
  "project_id": "kkfashion-f51ff",
  "private_key_id": "0b0b1fa8bd748a0faec459e140076739972b90e8",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAiMjkKVER2UWh\njpt6Vk0wGPjzdAruNnJ6BXqcw09HjNcUPkrFFgBq8eCSge8tAeH/jTiyTZCAgZUe\nFx8Fa0zr+10KLtV2KLg2V4v55XgFIplw4Tb1TIbfAW5+pmb3iu7QAas6vok5RWPx\ndi4m/dyIsTiE3j86Ixdb5aYthDsPLHbV+rJrGskVh4kSJQqm+E7TWaUNuluZ5YdG\nO+O6rkfiVRvyUR9X0CODG1xPJIdodtYC/bSn3U0uyZ+woafyJ+0+zXomDJBibuTD\nI6UiezX/tsubZ26QyoYu72mtdFqyub/UjRNFv/BJe8wosG4gMmNGru+o909IJhjB\ndlr6cX9XAgMBAAECggEANbbztRQB1iTz1DrhDaR+LGkLK4C4e/UcwwY8SvgCakfU\nyYUHfyzAORX6PWWawMfBsXZI1xXktrVwUNDKisyAzWV3c5vVWf3KRv7twm5OqcAZ\nZvCuUIllJ1pS5WqvV2ifb9DHYMA/sIa3d2otPhudJ1WqGweWRDX+Elljn1dA0t5r\nzO9PmC0DTaCjdXcDYJHVH4+z9mdl2Gnb+S1i1UQjIsiw56QgoN3RNeJOoGJHW4RJ\nT+ParjtiRGDq2mQSX1XrIkEVafX0QZc0zkBg2lp+8x6TN6goZWOhRzRnj/7COfOV\n5zXLZCq4A8Jh1spNMZfcKNbPKxCAdMhx91IxxeJEwQKBgQD+rZYd9BP2XOnXSD73\nZbZwnUlxDmNU+PPgMizmbx34fjnzLeVUV6xPVmVT6NodCxzL5S+MilCsrduzkxhY\n5VYct3AwUC6BuMslPtAwqGRXdkELplWcKmD9PWXtIn/sJuV/mihyvYq8UAiBZ59a\nqcpkH1EREZgQtleTv8wnoG7nTwKBgQDBiJ9ScSM5nzC/wrII2AGpi/a6Nmbtin1v\ns+Dln7KxFE0QdNK6ErMPqAqX9ZhvNkPZjrIP5FbMhu7w8Qb5UHhImgLYNtJD37+M\nlnSCuFH+Ge6h6EDPPfnhDlsv+l9tP4ZLKn3nr/Enc1cZV1Oqn0Z7I72jbGuvLZnH\ntkePXfxleQKBgQDEDLis4kGjuy6/7Pub0w64bjwk7eCFfwetpLJvyUYXDoRpsQED\nBmK8yFNEXtHY3b8TLqCF3cvwwf2IpUlu1UyO2p9gcbj7X1fymgIGEvr7YSr9XtQ0\nXWNATs1x2McE8YRl0DQm78Ym5K1HgI9paZ9Fp93t989JvjR4poLwVk5JfQKBgH3y\nhYzHaB8lxDnnYKl0uZA3L/f7U3yfNgatz1xgU4/+IDDndgP2C2XS/CHsiKlHbVx2\nCtdgyEQORA21Lc6uWbkV0WgYNTpKsIOznls7zNBK3Aut9A9qy+V0zE8q51NXlfPw\n0UMoMw5zd2lcdWyCfwHAPrfN5T55tKxNqcBZb9oxAoGABDVjfRUcEuTl9Z2GRddw\nIK2YXf6LBeMFkwIF8j2Lxkbrf1HSSCpJ9BTO84j751BmR+TM+uDVxv8ZqDEmHo4s\nNu+bxNmyvaxSycgfcWUVqXTrPWX7FEXSpVmGd8C7aEJpTZMeO6hn2wKBkiqY76YM\nmZCrBhM9bDLWzyBfcVNtOXU=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@kkfashion-f51ff.iam.gserviceaccount.com",
  "client_id": "113003982145951280521",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kkfashion-f51ff.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

db = None
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_KEY_DICT)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firestore Connected Successfully!")
except Exception as e:
    print("Firestore Init Error:", e)

# =========================================================
# ADMIN PANEL HTML
# =========================================================
ADMIN_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Admin | KK Fashion</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #eab308; }
        .golden-glow { box-shadow: 0 0 20px rgba(234, 179, 8, 0.15); }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-900 text-gray-200 min-h-screen">
    {% if not session.get('admin_logged_in') %}
    <!-- PREMIUM LOGIN UI -->
    <div class="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div class="bg-gray-800 p-10 rounded-2xl golden-glow w-96 text-center border-t-4 border-yellow-500 transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <div class="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">👑</div>
            <h2 class="text-2xl font-extrabold text-yellow-500 mb-2 tracking-wide">MASTER ADMIN</h2>
            <p class="text-xs text-gray-400 mb-6 uppercase tracking-widest">Secure Portal</p>
            <form action="/login" method="POST" class="flex flex-col gap-5 mt-2">
                <input type="email" name="email" placeholder="Admin Gmail ID" required class="p-4 border border-gray-600 rounded-lg text-center font-semibold bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300">
                <input type="password" name="password" placeholder="Password" required class="p-4 border border-gray-600 rounded-lg text-center font-semibold bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300">
                <button type="submit" class="bg-gradient-to-r from-yellow-600 to-yellow-400 text-gray-900 font-extrabold py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-300 transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                    AUTHORIZE ACCESS
                </button>
            </form>
        </div>
    </div>
    {% else %}
    <!-- PREMIUM ADMIN DASHBOARD -->
    <nav class="bg-gray-900 border-b border-gray-800 shadow-lg p-4 sticky top-0 z-50 flex justify-between items-center backdrop-blur-md bg-opacity-90">
        <h1 class="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">
            KK FASHION <span class="text-sm font-normal text-gray-400 tracking-normal ml-2">| Premium Panel</span>
        </h1>
        <div class="flex gap-4 items-center">
            <a href="/logout" class="border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300">Logout</a>
        </div>
    </nav>

    <main class="max-w-6xl mx-auto p-6 mt-4 relative">
        <!-- SMOOTH TABS (NO RELOAD) -->
        <div class="flex space-x-6 md:space-x-10 border-b border-gray-700 mb-8 pb-3 overflow-x-auto whitespace-nowrap text-sm uppercase tracking-wider font-semibold">
            <button onclick="switchTab('orders')" id="btn-orders" class="tab-btn pb-2 border-b-3 transition-colors cursor-pointer text-gray-500 border-transparent hover:text-yellow-400">📦 Orders</button>
            <button onclick="switchTab('products')" id="btn-products" class="tab-btn pb-2 border-b-3 transition-colors cursor-pointer text-gray-500 border-transparent hover:text-yellow-400">🛍️ Products</button>
            <button onclick="switchTab('categories')" id="btn-categories" class="tab-btn pb-2 border-b-3 transition-colors cursor-pointer text-gray-500 border-transparent hover:text-yellow-400">🗂️ Categories</button>
            <button onclick="switchTab('banners')" id="btn-banners" class="tab-btn pb-2 border-b-3 transition-colors cursor-pointer text-gray-500 border-transparent hover:text-yellow-400">🖼️ Banners</button>
            <button onclick="switchTab('settings')" id="btn-settings" class="tab-btn pb-2 border-b-3 transition-colors cursor-pointer text-gray-500 border-transparent hover:text-yellow-400">⚙️ Settings</button>
        </div>

        <!-- 📦 ORDERS TAB -->
        <div id="tab-orders" class="tab-content active">
            <h3 class="text-2xl font-bold mb-6 text-white">Manage Orders</h3>
            <div class="space-y-4">
                {% if orders|length == 0 %}
                    <p class="text-gray-500 italic">No orders found.</p>
                {% endif %}
                {% for o in orders %}
                <div class="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-yellow-500/40 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                    <div>
                        <h4 class="font-bold text-lg text-yellow-500">{{ o.name }} <span class="text-gray-400 text-sm font-normal">({{ o.mobile }})</span></h4>
                        <p class="text-sm text-gray-300 mt-1"><strong>Address:</strong> {{ o.address }}</p>
                        <p class="text-sm font-bold text-green-400 mt-2">Total: ₹{{ o.totalAmount }} <span class="text-xs text-gray-400 ml-2">({{ o.paymentMethod }})</span></p>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <form action="/update_order_status/{{ o.id }}" method="POST" class="flex items-center gap-2">
                            <select name="status" class="p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:outline-none focus:border-yellow-500 font-semibold cursor-pointer transition-colors" onchange="this.form.submit()">
                                <option value="Recent" {% if o.status == 'Recent' %}selected{% endif %}>Recent</option>
                                <option value="Pending" {% if o.status == 'Pending' %}selected{% endif %}>Pending</option>
                                <option value="Completed" {% if o.status == 'Completed' %}selected{% endif %}>Completed</option>
                            </select>
                        </form>
                        <form action="/delete_order/{{ o.id }}" method="POST" onsubmit="return confirm('Permanently delete this order?');">
                            <button type="submit" class="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all duration-300">🗑️ Delete</button>
                        </form>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>

        <!-- 🛍️ PRODUCTS TAB -->
        <div id="tab-products" class="tab-content">
            <div class="bg-gray-800 p-6 rounded-2xl shadow-xl mb-10 border-t-2 border-yellow-500">
                <h3 class="text-xl font-bold mb-5 text-white">Add New Product</h3>
                <form action="/add_product" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <input type="text" name="name" placeholder="Product Name (e.g. Baggy Jeans)" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <input type="text" name="image_url" placeholder="Image URLs (Comma separated)" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <select name="categoryId" class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:border-yellow-500 focus:outline-none cursor-pointer">
                        <option value="">Select Category</option>
                        {% for cat in settings.mainCategories %}
                            <option value="{{ cat.id }}">{{ cat.name }}</option>
                        {% endfor %}
                    </select>
                    <select name="source" class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:border-yellow-500 focus:outline-none cursor-pointer">
                        <option value="Unique Fashion">Unique Fashion (Default)</option>
                        <option value="Flipkart">Flipkart (Shows Tag)</option>
                    </select>
                    <input type="number" name="price" placeholder="Price (₹)" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <input type="number" name="discount" placeholder="Discount % (Optional)" class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                        <input type="checkbox" name="in_stock" id="in_stock" checked class="w-5 h-5 accent-yellow-500 cursor-pointer">
                        <label for="in_stock" class="font-semibold text-gray-300 cursor-pointer">In Stock</label>
                    </div>
                    <button type="submit" class="col-span-full md:col-span-2 bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-500/20">➕ Add Product</button>
                </form>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <!-- Products sorted by newest first via Python -->
                {% for p in products %}
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg relative group hover:-translate-y-1 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden flex flex-col">
                    <img src="{{ p.imageUrl[0] if p.imageUrl is iterable and p.imageUrl is not string else p.imageUrl }}" class="w-full h-48 object-cover rounded-lg mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <h4 class="font-bold text-sm truncate text-gray-200">{{ p.name }}</h4>
                    <div class="flex justify-between items-center mt-1">
                        <p class="text-yellow-500 font-extrabold text-lg">₹{{ p.price }}</p>
                        <span class="text-xs font-bold px-2 py-1 rounded bg-gray-700 {{ 'text-green-400' if p.inStock else 'text-red-400' }}">{{ 'In Stock' if p.inStock else 'Out of Stock' }}</span>
                    </div>
                    {% if p.source == 'Flipkart' %}
                        <span class="text-[10px] bg-blue-600 text-white px-2 py-1 rounded mt-2 self-start font-bold flex items-center gap-1">
                            <img src="https://rukminim1.flixcart.com/www/200/200/promos/20/07/2022/410bad52-f673-455b-8664-df8203b5b7c8.png?q=90" class="w-3 h-3 rounded-full bg-white"> By Flipkart
                        </span>
                    {% endif %}
                    
                    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <button onclick="openEditModal('{{ p.id }}', '{{ p.name|replace("'", "\\'") }}', '{{ p.price }}', '{{ p.discount }}', '{{ p.source }}', '{{ p.inStock }}')" class="bg-gray-900 text-yellow-500 p-2 rounded-full shadow-lg border border-yellow-500/30 hover:bg-yellow-500 hover:text-gray-900 transition-colors">✏️</button>
                        <form action="/delete_product/{{ p.id }}" method="POST" onsubmit="return confirm('Delete product?');">
                            <button type="submit" class="bg-gray-900 text-red-500 p-2 rounded-full shadow-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors">🗑️</button>
                        </form>
                    </div>
                </div>
                {% endfor %}
            </div>

            <!-- Edit Product Modal -->
            <div id="editModal" class="fixed inset-0 bg-black/80 hidden items-center justify-center z-[100] backdrop-blur-sm">
                <div class="bg-gray-800 p-6 rounded-2xl border-t-2 border-yellow-500 w-[400px] shadow-2xl relative">
                    <button onclick="closeEditModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                    <h3 class="text-xl font-bold mb-5 text-white">Edit Product</h3>
                    <form id="editForm" action="" method="POST" class="flex flex-col gap-4">
                        <div>
                            <label class="text-xs text-gray-400 uppercase tracking-wide">Product Name</label>
                            <input type="text" name="name" id="editName" required class="w-full p-3 mt-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs text-gray-400 uppercase tracking-wide">Price (₹)</label>
                                <input type="number" name="price" id="editPrice" required class="w-full p-3 mt-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 uppercase tracking-wide">Discount %</label>
                                <input type="number" name="discount" id="editDiscount" class="w-full p-3 mt-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 uppercase tracking-wide">Source</label>
                            <select name="source" id="editSource" class="w-full p-3 mt-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                                <option value="Unique Fashion">Unique Fashion</option>
                                <option value="Flipkart">Flipkart</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded border border-gray-600">
                            <input type="checkbox" name="in_stock" id="editInStock" class="w-5 h-5 accent-yellow-500">
                            <label for="editInStock" class="font-semibold text-gray-300">In Stock</label>
                        </div>
                        <button type="submit" class="bg-yellow-500 text-gray-900 font-bold py-3 rounded hover:bg-yellow-400 transition-all mt-2">💾 Save Changes</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- 🗂️ CATEGORIES TAB -->
        <div id="tab-categories" class="tab-content">
            <div class="bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-gray-700">
                <h3 class="text-xl font-bold mb-4 text-white">Add Category (For Home Page Bubbles)</h3>
                <form action="/add_category" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="cat_name" placeholder="Name (e.g. Baggy Jeans)" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                    <input type="text" name="image_url" placeholder="Image URL (For Bubble)" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none">
                    <button type="submit" class="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 rounded-lg font-bold transition-all duration-300 shadow-lg">Add Category</button>
                </form>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
                {% for cat in settings.mainCategories %}
                <div class="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center text-center border-t-4 border-yellow-500 hover:bg-gray-750 transition-colors relative group">
                    <img src="{{ cat.image if cat.image else 'https://via.placeholder.com/150' }}" class="w-16 h-16 rounded-full object-cover border-2 border-gray-600 mb-3">
                    <span class="font-bold text-gray-200 text-sm">{{ cat.name }}</span>
                    <form action="/delete_category/{{ cat.id }}" method="POST" class="mt-3">
                        <button type="submit" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-colors">Delete</button>
                    </form>
                </div>
                {% endfor %}
            </div>
        </div>

        <!-- 🖼️ BANNERS TAB -->
        <div id="tab-banners" class="tab-content">
            <div class="bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-gray-700">
                <h3 class="text-xl font-bold mb-4 text-white">Add Home Banner</h3>
                <form action="/add_banner" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="image" placeholder="Banner Image URL" required class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <input type="text" name="link" placeholder="Redirect Link (Optional)" class="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                    <button type="submit" class="col-span-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 shadow-lg">Upload Banner</button>
                </form>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {% for b in settings.banners %}
                <div class="bg-gray-800 p-4 rounded-xl shadow-lg flex items-center gap-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <img src="{{ b.image }}" class="w-32 h-20 object-cover rounded shadow-md border border-gray-700">
                    <div class="flex-grow text-xs text-yellow-500 font-mono truncate bg-gray-900 p-2 rounded">{{ b.link or 'No Redirect Link' }}</div>
                    <form action="/delete_banner/{{ b.id }}" method="POST">
                        <button type="submit" class="bg-gray-900 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors">🗑️</button>
                    </form>
                </div>
                {% endfor %}
            </div>
        </div>

        <!-- ⚙️ SETTINGS TAB -->
        <div id="tab-settings" class="tab-content">
            <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border-t-2 border-yellow-500 golden-glow">
                <h3 class="text-2xl font-bold mb-8 text-center text-white">Platform Settings & Payments</h3>
                <form action="/update_settings" method="POST" class="flex flex-col gap-6">
                    <!-- Payment Setup -->
                    <div class="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <h4 class="text-yellow-500 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">💰 Payment Setup</h4>
                        <div class="flex flex-col gap-4">
                            <div>
                                <label class="text-gray-300 block mb-1 text-xs">Your UPI ID (For Direct Payments)</label>
                                <input type="text" name="upiId" value="{{ settings.upiId }}" placeholder="e.g. 9876543210@ybl" class="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 outline-none">
                            </div>
                            <div>
                                <label class="text-gray-300 block mb-1 text-xs">Payment QR Code Image URL</label>
                                <input type="url" name="qrCodeUrl" value="{{ settings.qrCodeUrl }}" placeholder="Image Link for Scanner" class="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Support Setup -->
                    <div class="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <h4 class="text-yellow-500 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">📞 Support Setup</h4>
                        <div>
                            <label class="text-gray-300 block mb-1 text-xs">WhatsApp Support Number</label>
                            <input type="text" name="waNumber" value="{{ settings.waNumber }}" placeholder="+91..." class="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:border-yellow-500 outline-none">
                        </div>
                    </div>

                    <button type="submit" class="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-extrabold py-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg transform hover:scale-[1.02]">
                        SAVE CONFIGURATION
                    </button>
                </form>
            </div>
        </div>

    </main>

    <!-- SPA TAB LOGIC (SMOOTH SWITCHING) -->
    <script>
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => {
                el.classList.remove('active');
            });
            document.getElementById('tab-' + tabId).classList.add('active');
            
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('border-yellow-500', 'text-yellow-500');
                el.classList.add('border-transparent', 'text-gray-500');
            });
            const activeBtn = document.getElementById('btn-' + tabId);
            activeBtn.classList.remove('border-transparent', 'text-gray-500');
            activeBtn.classList.add('border-yellow-500', 'text-yellow-500');
            
            window.history.pushState({}, '', '/?tab=' + tabId);
        }

        function openEditModal(id, name, price, discount, source, inStock) {
            document.getElementById('editForm').action = '/edit_product/' + id;
            document.getElementById('editName').value = name;
            document.getElementById('editPrice').value = price;
            document.getElementById('editDiscount').value = discount || 0;
            document.getElementById('editSource').value = source || 'Unique Fashion';
            document.getElementById('editInStock').checked = inStock === 'True';
            document.getElementById('editModal').style.display = 'flex';
        }
        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        window.onload = () => {
            const urlParams = new URLSearchParams(window.location.search);
            let tab = urlParams.get('tab') || 'orders';
            switchTab(tab);
        };
    </script>
    {% endif %}
</body>
</html>
"""

# =========================================================
# ROUTES - FLASK BACKEND LOGIC
# =========================================================

def get_timestamp(p):
    ts = p.get('timestamp')
    if hasattr(ts, 'timestamp'):
        return ts.timestamp()
    return 0

@app.route('/')
def admin_dashboard():
    products = []
    orders = []
    settings = {}
    
    if session.get('admin_logged_in'):
        if db is None:
            return "Firebase Error! Please check your credentials.", 500
            
        try:
            for doc in db.collection('products').stream():
                p = doc.to_dict()
                p['id'] = doc.id
                products.append(p)
                
            for doc in db.collection('orders').stream():
                o = doc.to_dict()
                o['id'] = doc.id
                orders.append(o)
            
            orders.sort(key=lambda x: x.get('status', ''), reverse=True)
            products.sort(key=get_timestamp, reverse=True)
            
            s_ref = db.collection('settings').document('storeData').get()
            if s_ref.exists:
                settings = s_ref.to_dict()
            
            if 'mainCategories' not in settings:
                settings['mainCategories'] = []
            if 'banners' not in settings:
                settings['banners'] = []
                
        except Exception as e:
            print("Data Fetch Error:", e)
            
    return render_template_string(
        ADMIN_HTML, 
        products=products, 
        orders=orders, 
        settings=settings
    )

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '').strip()
    
    if email == "monubhaipvr@gmail.com" and password == "monu@pvr":
        session['admin_logged_in'] = True
        return redirect('/?tab=orders')
    
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect('/')

@app.route('/add_product', methods=['POST'])
def add_product():
    if not session.get('admin_logged_in'): 
        return redirect('/')
        
    raw_img = request.form.get('image_url', '')
    if "|" in raw_img:
        img_list = [u.strip() for u in raw_img.split("|")]
    else:
        img_list = [u.strip() for u in raw_img.split(",")]
        
    in_stock_val = True if request.form.get('in_stock') else False
    
    new_prod = {
        'name': request.form.get('name'),
        'imageUrl': img_list,
        'mainCategoryId': request.form.get('categoryId', ''),
        'source': request.form.get('source', 'Unique Fashion'),
        'price': request.form.get('price', 0, type=float),
        'discount': request.form.get('discount', 0, type=float),
        'inStock': in_stock_val,
        'timestamp': firestore.SERVER_TIMESTAMP
    }
    db.collection('products').add(new_prod)
    return redirect('/?tab=products')

@app.route('/edit_product/<pid>', methods=['POST'])
def edit_product(pid):
    if session.get('admin_logged_in'):
        in_stock_val = True if request.form.get('in_stock') else False
        db.collection('products').document(pid).update({
            'name': request.form.get('name'),
            'price': request.form.get('price', 0, type=float),
            'discount': request.form.get('discount', 0, type=float),
            'source': request.form.get('source', 'Unique Fashion'),
            'inStock': in_stock_val
        })
    return redirect('/?tab=products')

@app.route('/delete_product/<pid>', methods=['POST'])
def delete_product(pid):
    if session.get('admin_logged_in'):
        db.collection('products').document(pid).delete()
    return redirect('/?tab=products')

@app.route('/update_order_status/<oid>', methods=['POST'])
def update_order_status(oid):
    if session.get('admin_logged_in'):
        status_val = request.form.get('status')
        db.collection('orders').document(oid).update({'status': status_val})
    return redirect('/?tab=orders')

@app.route('/delete_order/<oid>', methods=['POST'])
def delete_order(oid):
    if session.get('admin_logged_in'):
        db.collection('orders').document(oid).delete()
    return redirect('/?tab=orders')

def update_storedata_array(array_name, new_item=None, delete_id=None):
    doc_ref = db.collection('settings').document('storeData')
    data = doc_ref.get().to_dict() or {}
    arr = data.get(array_name, [])
    if new_item:
        arr.append(new_item)
    elif delete_id:
        arr = [item for item in arr if item.get('id') != delete_id]
    doc_ref.set({array_name: arr}, merge=True)

@app.route('/add_category', methods=['POST'])
def add_category():
    if session.get('admin_logged_in'):
        cat_id = f"cat_{int(time.time()*1000)}"
        new_cat = {
            'id': cat_id, 
            'name': request.form.get('cat_name'), 
            'image': request.form.get('image_url'),
            'shopId': 'GLOBAL'
        }
        update_storedata_array('mainCategories', new_item=new_cat)
    return redirect('/?tab=categories')

@app.route('/delete_category/<cid>', methods=['POST'])
def delete_category(cid):
    if session.get('admin_logged_in'):
        update_storedata_array('mainCategories', delete_id=cid)
    return redirect('/?tab=categories')

@app.route('/add_banner', methods=['POST'])
def add_banner():
    if session.get('admin_logged_in'):
        ban_id = f"ban_{int(time.time()*1000)}"
        new_b = {
            'id': ban_id, 
            'image': request.form.get('image'), 
            'link': request.form.get('link')
        }
        update_storedata_array('banners', new_item=new_b)
    return redirect('/?tab=banners')

@app.route('/delete_banner/<bid>', methods=['POST'])
def delete_banner(bid):
    if session.get('admin_logged_in'):
        update_storedata_array('banners', delete_id=bid)
    return redirect('/?tab=banners')

@app.route('/update_settings', methods=['POST'])
def update_settings():
    if session.get('admin_logged_in'):
        db.collection('settings').document('storeData').set({
            'waNumber': request.form.get('waNumber'),
            'upiId': request.form.get('upiId'),
            'qrCodeUrl': request.form.get('qrCodeUrl')
        }, merge=True)
    return redirect('/?tab=settings')

if __name__ == '__main__':
    app.run(debug=True)
