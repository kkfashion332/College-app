// ================= FIREBASE SETUP =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBXG231Aww3fBil2cY2xMl0m5pOmtfXoRs",
    authDomain: "korean-language-e1c07.firebaseapp.com",
    projectId: "korean-language-e1c07",
    storageBucket: "korean-language-e1c07.firebasestorage.app",
    messagingSenderId: "947925943853",
    appId: "1:947925943853:web:a1c37f38a12a1608a55aa4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.deleteItem = async (colName, id) => {
    if(confirm("Are you sure you want to delete this?")) {
        try { await deleteDoc(doc(db, colName, id)); } 
        catch(e) { console.error(e); alert("Error deleting item."); }
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

// App Main Tabs
const tabBtns = document.querySelectorAll('.main-tabs .tab-btn');
const tabContents = document.querySelectorAll('main .tab-content');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// Admin Horizontal Tabs
const adminTabBtns = document.querySelectorAll('.admin-tabs-nav .admin-tab-btn');
const adminTabContents = document.querySelectorAll('.admin-scroll-wrapper .admin-card');
adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminTabContents.forEach(c => c.classList.remove('active'));
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
    } else { alert("Incorrect PIN!"); pinInput.value = ''; }
});
document.getElementById('close-admin').addEventListener('click', () => adminPanel.style.display = 'none');

// ================= FIREBASE DATABASE ADD =================
document.getElementById('btn-add-class').addEventListener('click', async () => {
    const title = document.getElementById('class-title').value;
    const url = document.getElementById('class-url').value; 
    const date = document.getElementById('class-date').value;
    const start = document.getElementById('class-start').value;
    const end = document.getElementById('class-end').value;

    if(!title || !url) return alert("Title & Valid URL required!");
    try {
        await addDoc(collection(db, "classes"), { title, url, date, start, end, timestamp: Date.now() });
        document.getElementById('class-title').value = '';
        document.getElementById('class-url').value = '';
    } catch(e) { alert("Failed to add"); }
});

document.getElementById('btn-add-pdf').addEventListener('click', async () => {
    const title = document.getElementById('pdf-title').value;
    const pdfUrl = document.getElementById('pdf-url').value;
    if(!title || !pdfUrl) return alert("Title and PDF URL required!");
    try {
        await addDoc(collection(db, "pdfs"), { title, pdfUrl, timestamp: Date.now() });
        document.getElementById('pdf-title').value = ''; document.getElementById('pdf-url').value = '';
    } catch(e) { alert("Failed to add"); }
});

document.getElementById('btn-add-ann').addEventListener('click', async () => {
    const title = document.getElementById('ann-title').value;
    const bannerUrl = document.getElementById('ann-banner').value;
    const text = document.getElementById('ann-text').value;
    if(!title || !text) return alert("Title and Message required!");
    try {
        await addDoc(collection(db, "announcements"), { title, bannerUrl, text, date: new Date().toLocaleDateString(), timestamp: Date.now() });
        document.getElementById('ann-title').value = ''; document.getElementById('ann-banner').value = ''; document.getElementById('ann-text').value = '';
    } catch(e) { alert("Failed to add"); }
});

document.getElementById('btn-add-banner').addEventListener('click', async () => {
    const imgUrl = document.getElementById('banner-img').value;
    const linkUrl = document.getElementById('banner-link').value;
    if(!imgUrl) return alert("Banner Image URL required!");
    try {
        await addDoc(collection(db, "banners"), { imgUrl, linkUrl, timestamp: Date.now() });
        document.getElementById('banner-img').value = ''; document.getElementById('banner-link').value = '';
    } catch(e) { alert("Failed to add"); }
});

// ================= URL PARSER FOR PLAYER =================
function getPlayerHtml(mediaUrl, id) {
    if(!mediaUrl) return '';
    
    // 1. Google Drive Link Extraction (Video Tag for Plyr)
    if (mediaUrl.includes("drive.google.com")) {
        const match = mediaUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            // Direct download link for streaming
            let directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
            return `<video id="player-${id}" playsinline controls style="width: 100%; border-radius: 8px;">
                        <source src="${directUrl}" type="video/mp4" />
                    </video>`;
        }
    }
    
    // 2. YouTube Link Extraction
    let ytId = null;
    if (mediaUrl.includes("youtube.com/live/")) ytId = mediaUrl.split("youtube.com/live/")[1].split("?")[0].split("/")[0];
    else if (mediaUrl.includes("v=")) ytId = new URL(mediaUrl).searchParams.get("v");
    else if (mediaUrl.includes("youtu.be/")) ytId = mediaUrl.split("youtu.be/")[1].split("?")[0].split("/")[0];
    else if (mediaUrl.includes("embed/")) ytId = mediaUrl.split("embed/")[1].split("?")[0];

    if (ytId) {
        return `<div class="plyr__video-embed" id="player-${id}">
                    <iframe src="https://www.youtube.com/embed/${ytId}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                </div>`;
    }

    return ''; 
}

// ================= FIREBASE REAL-TIME LISTENERS =================
function listenToData() {
    
    onSnapshot(query(collection(db, "banners"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('banner-container');
        const adminList = document.getElementById('admin-banner-list');
        let html = ''; let adminHtml = '';
        snapshot.forEach(doc => {
            const b = doc.data(); const id = doc.id;
            html += `<a href="${b.linkUrl || '#'}" class="banner" target="${b.linkUrl ? '_blank' : '_self'}"><img src="${b.imgUrl}" alt="Banner"></a>`;
            adminHtml += `<div class="admin-list-item"><img src="${b.imgUrl}" class="admin-item-img"><button class="del-btn" onclick="deleteItem('banners', '${id}')">Delete</button></div>`;
        });
        if(snapshot.empty) { container.style.display = 'none'; adminList.innerHTML = '<div class="empty-msg">No banners</div>'; } 
        else { container.style.display = 'flex'; container.innerHTML = html; adminList.innerHTML = adminHtml; }
    });

    onSnapshot(query(collection(db, "classes"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('classes-list');
        const adminList = document.getElementById('admin-class-list');
        
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No classes scheduled yet.</div>'; adminList.innerHTML = '<div class="empty-msg">No classes</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const c = doc.data(); const id = doc.id;
                const mediaHTML = getPlayerHtml(c.url || c.embedUrl, id); 
                
                html += `
                    <div class="card">
                        <h3 class="card-title">${c.title}</h3>
                        <div class="video-wrapper">
                            ${mediaHTML}
                        </div>
                        <div class="class-meta">
                            ${c.date ? `<span>📅 ${c.date}</span>` : ''}
                            ${c.start ? `<span>🟢 Live: ${c.start}</span>` : ''}
                            ${c.end ? `<span>🔴 Ended: ${c.end}</span>` : ''}
                        </div>
                    </div>`;
                adminHtml += `<div class="admin-list-item"><span class="admin-item-text">${c.title}</span><button class="del-btn" onclick="deleteItem('classes', '${id}')">Delete</button></div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;

            const playerElements = document.querySelectorAll('.video-wrapper video, .video-wrapper .plyr__video-embed');
            playerElements.forEach(el => {
                new Plyr(el, {
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
                    settings: ['quality', 'speed']
                });
            });
        }
    });

    onSnapshot(query(collection(db, "pdfs"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('pdfs-list');
        const adminList = document.getElementById('admin-pdf-list');
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No notes available.</div>'; adminList.innerHTML = '<div class="empty-msg">No notes</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const p = doc.data(); const id = doc.id;
                html += `<a href="${p.pdfUrl}" target="_blank" class="pdf-item"><div class="pdf-item-left"><div class="pdf-icon-circle">📄</div><span class="pdf-title-text">${p.title}</span></div><span class="pdf-open-btn">View PDF</span></a>`;
                adminHtml += `<div class="admin-list-item"><span class="admin-item-text">${p.title}</span><button class="del-btn" onclick="deleteItem('pdfs', '${id}')">Delete</button></div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;
        }
    });

    onSnapshot(query(collection(db, "announcements"), orderBy("timestamp", "desc")), (snapshot) => {
        const container = document.getElementById('announcements-list');
        const adminList = document.getElementById('admin-ann-list');
        if(snapshot.empty) { container.innerHTML = '<div class="empty-msg">No recent announcements.</div>'; adminList.innerHTML = '<div class="empty-msg">No announcements</div>'; }
        else {
            let html = ''; let adminHtml = '';
            snapshot.forEach(doc => {
                const a = doc.data(); const id = doc.id;
                html += `<div class="card"><h3 class="card-title">📢 ${a.title}</h3>${a.bannerUrl ? `<img src="${a.bannerUrl}" class="ann-banner-img" alt="Announcement Banner">` : ''}<div class="ann-text">${a.text}</div><span class="ann-date">Posted on: ${a.date}</span></div>`;
                adminHtml += `<div class="admin-list-item"><span class="admin-item-text">${a.title}</span><button class="del-btn" onclick="deleteItem('announcements', '${id}')">Delete</button></div>`;
            });
            container.innerHTML = html; adminList.innerHTML = adminHtml;
        }
    });
}

// ================= FULLSCREEN LANDSCAPE ROTATION FIX =================
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(e => console.log("Orientation lock not supported/allowed", e));
        }
    } else {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
});
