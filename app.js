// ================= FIREBASE SETUP =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7p8eRQZ6Qt_gQ0AsVoKdL_oLI7EhsAqc",
    authDomain: "korean-language-e1c07.firebaseapp.com",
    projectId: "korean-language-e1c07",
    storageBucket: "korean-language-e1c07.firebasestorage.app",
    messagingSenderId: "947925943853",
    appId: "1:947925943853:web:a1c37f38a12a1608a55aa4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Delete Function for Admin Panel
window.deleteItem = async (colName, id) => {
    if(confirm("Are you sure you want to delete this?")) {
        try {
            await deleteDoc(doc(db, colName, id));
        } catch(e) { 
            console.error(e); 
            alert("Error deleting item."); 
        }
    }
};

// ================= SPLASH SCREEN & TABS =================
document.addEventListener("DOMContentLoaded", () => {
    const chars = ["한","국","어","안","녕","사","랑","빛","꽃","달","별","길"];
    const container = document.getElementById("particles");
    for(let i=0; i<25; i++){
        const s = document.createElement("span");
        s.textContent = chars[i % chars.length];
        s.style.left = Math.random()*100 + "%";
        s.style.top = (50 + Math.random()*50) + "%";
        s.style.fontSize = (14 + Math.random()*22) + "px";
        s.style.setProperty("--dx", ((Math.random()-0.5)*300) + "px");
        s.style.setProperty("--dy", (-300 - Math.random()*400) + "px");
        s.style.animationDuration = (8 + Math.random()*8) + "s";
        s.style.animationDelay = (Math.random()*8) + "s";
        container.appendChild(s);
    }

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            listenToData(); 
        }, 800);
    }, 4500);
});

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// ================= ADMIN SECRET ACCESS =================
const logoBtn = document.getElementById('secret-logo');
const pinModal = document.getElementById('pin-modal');
const pinInput = document.getElementById('pin-input');
const adminPanel = document.getElementById('admin-panel');
let tapCount = 0, tapTimeout;

logoBtn.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimeout);
    if(tapCount >= 7) {
        pinModal.style.display = 'flex';
        pinInput.value = '';
        pinInput.focus();
        tapCount = 0;
    }
    tapTimeout = setTimeout(() => { tapCount = 0; }, 1500);
});

document.getElementById('cancel-pin').addEventListener('click', () => pinModal.style.display = 'none');
document.getElementById('submit-pin').addEventListener('click', () => {
    if(pinInput.value === '7890') {
        pinModal.style.display = 'none';
        adminPanel.style.display = 'flex';
    } else {
        alert("Incorrect PIN!");
        pinInput.value = '';
    }
});
document.getElementById('close-admin').addEventListener('click', () => adminPanel.style.display = 'none');


// ================= FIREBASE DATABASE (Add Data) =================

function getYouTubeEmbedUrl(url) {
    let videoId = "";
    if(url.includes('v=')) videoId = url.split('v=')[1].substring(0, 11);
    else if(url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].substring(0, 11);
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
}

// 1. Add Class
document.getElementById('btn-add-class').addEventListener('click', async () => {
    const title = document.getElementById('class-title').value;
    const url = document.getElementById('class-url').value;
    const date = document.getElementById('class-date').value;
    const start = document.getElementById('class-start').value;
    const end = document.getElementById('class-end').value;

    const embedUrl = getYouTubeEmbedUrl(url);
    if(!title || !embedUrl) return alert("Title & Valid YouTube URL required!");

    try {
        await addDoc(collection(db, "classes"), { title, embedUrl, date, start, end, timestamp: Date.now() });
        document.getElementById('class-title').value = '';
        document.getElementById('class-url').value = '';
    } catch(e) { alert("Failed to add"); }
});

// 2. Add PDF Note (Direct Link)
document.getElementById('btn-add-pdf').addEventListener('click', async () => {
    const title = document.getElementById('pdf-title').value;
    const pdfUrl = document.getElementById('pdf-url').value;
    
    if(!title || !pdfUrl) return alert("Title and PDF URL required!");

    try {
        await addDoc(collection(db, "pdfs"), { title, pdfUrl, timestamp: Date.now() });
        document.getElementById('pdf-title').value = '';
        document.getElementById('pdf-url').value = '';
    } catch(e) { alert("Failed to add"); }
});

// 3. Add Announcement (With Optional Banner)
document.getElementById('btn-add-ann').addEventListener('click', async () => {
    const title = document.getElementById('ann-title').value;
    const bannerUrl = document.getElementById('ann-banner').value;
    const text = document.getElementById('ann-text').value;
    
    if(!title || !text) return alert("Title and Message required!");

    try {
        await addDoc(collection(db, "announcements"), { title, bannerUrl, text, date: new Date().toLocaleDateString(), timestamp: Date.now() });
        document.getElementById('ann-title').value = '';
        document.getElementById('ann-banner').value = '';
        document.getElementById('ann-text').value = '';
    } catch(e) { alert("Failed to add"); }
});

// 4. Add Home Banner
document.getElementById('btn-add-banner').addEventListener('click', async () => {
    const imgUrl = document.getElementById('banner-img').value;
    const linkUrl = document.getElementById('banner-link').value;
    
    if(!imgUrl) return alert("Banner Image URL required!");

    try {
        await addDoc(collection(db, "banners"), { imgUrl, linkUrl, timestamp: Date.now() });
        document.getElementById('banner-img').value = '';
        document.getElementById('banner-link').value = '';
    } catch(e) { alert("Failed to add"); }
});


// ================= FIREBASE REAL-TIME LISTENERS =================
function listenToData() {
    
    // Banners
    onSnapshot(query(collection(db, "banners"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('banner-container');
        const adminList = document.getElementById('admin-banner-list');
        
        let html = ''; let adminHtml = '';
        snapshot.forEach(doc => {
            const b = doc.data(); const id = doc.id;
            html += `<a href="${b.linkUrl || '#'}" class="banner" target="${b.linkUrl ? '_blank' : '_self'}">
                        <img src="${b.imgUrl}" alt="Banner">
                     </a>`;
            adminHtml += `<div class="admin-list-item">
                            <img src="${b.imgUrl}" class="admin-item-img">
                            <button class="del-btn" onclick="deleteItem('banners', '${id}')">Delete</button>
                          </div>`;
        });
        
        if(snapshot.empty) { container.style.display = 'none'; adminList.innerHTML = '<div class="empty-msg">No banners</div>'; } 
        else { container.style.display = 'flex'; container.innerHTML = html; adminList.innerHTML = adminHtml; }
    });

    // Classes
    onSnapshot(query(collection(db, "classes"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('classes-list');
        const adminList = document.getElementById('admin-class-list');
        
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No classes scheduled yet.</div>'; adminList.innerHTML = '<div class="empty-msg">No classes</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const c = doc.data(); const id = doc.id;
                html += `
                    <div class="card">
                        <h3 class="card-title">${c.title}</h3>
                        <div class="video-wrapper">
                            <iframe src="${c.embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
                        </div>
                        <div class="class-meta">
                            ${c.date ? `<span>📅 ${c.date}</span>` : ''}
                            ${c.start ? `<span>🟢 Live: ${c.start}</span>` : ''}
                            ${c.end ? `<span>🔴 Ended: ${c.end}</span>` : ''}
                        </div>
                    </div>`;
                adminHtml += `<div class="admin-list-item">
                                <span class="admin-item-text">${c.title}</span>
                                <button class="del-btn" onclick="deleteItem('classes', '${id}')">Delete</button>
                              </div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;
        }
    });

    // PDFs (Vertical List Style)
    onSnapshot(query(collection(db, "pdfs"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('pdfs-list');
        const adminList = document.getElementById('admin-pdf-list');
        
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No notes available.</div>'; adminList.innerHTML = '<div class="empty-msg">No notes</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const p = doc.data(); const id = doc.id;
                html += `
                    <a href="${p.pdfUrl}" target="_blank" class="pdf-item">
                        <div class="pdf-item-left">
                            <div class="pdf-icon-circle">📄</div>
                            <span class="pdf-title-text">${p.title}</span>
                        </div>
                        <span class="pdf-open-btn">View PDF</span>
                    </a>`;
                adminHtml += `<div class="admin-list-item">
                                <span class="admin-item-text">${p.title}</span>
                                <button class="del-btn" onclick="deleteItem('pdfs', '${id}')">Delete</button>
                              </div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;
        }
    });

    // Announcements
    onSnapshot(query(collection(db, "announcements"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('announcements-list');
        const adminList = document.getElementById('admin-ann-list');
        
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No recent announcements.</div>'; adminList.innerHTML = '<div class="empty-msg">No announcements</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const a = doc.data(); const id = doc.id;
                html += `
                    <div class="card">
                        <h3 class="card-title">📢 ${a.title}</h3>
                        ${a.bannerUrl ? `<img src="${a.bannerUrl}" class="ann-banner-img" alt="Announcement Banner">` : ''}
                        <div class="ann-text">${a.text}</div>
                        <span class="ann-date">Posted on: ${a.date}</span>
                    </div>`;
                adminHtml += `<div class="admin-list-item">
                                <span class="admin-item-text">${a.title}</span>
                                <button class="del-btn" onclick="deleteItem('announcements', '${id}')">Delete</button>
                              </div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;
        }
    });
}
