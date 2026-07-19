// ================= FIREBASE SETUP =================
// Note: This uses standard ES Modules to connect to Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy 
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

// ================= SPLASH SCREEN & PARTICLES =================
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

    // Hide Splash after 4.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            listenToData(); // Start Firebase real-time listeners
        }, 800);
    }, 4500);
});

// ================= TABS SWITCHING =================
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

let tapCount = 0;
let tapTimeout;

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
        adminPanel.style.display = 'block';
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
        await addDoc(collection(db, "classes"), {
            title, embedUrl, date, start, end, timestamp: Date.now()
        });
        alert("Class Added to Firebase!");
        document.getElementById('class-title').value = '';
        document.getElementById('class-url').value = '';
    } catch(e) { console.error("Error: ", e); alert("Failed to add"); }
});

// 2. Add Notes (PDF Images)
document.getElementById('btn-add-pdf').addEventListener('click', async () => {
    const title = document.getElementById('pdf-title').value;
    const urlsRaw = document.getElementById('pdf-urls').value;
    
    if(!title || !urlsRaw) return alert("Title and at least one Image URL required!");
    const imgArray = urlsRaw.split(/[\n,]+/).map(u => u.trim()).filter(u => u !== "");

    try {
        await addDoc(collection(db, "pdfs"), {
            title, images: imgArray, timestamp: Date.now()
        });
        alert("Notes Added to Firebase!");
        document.getElementById('pdf-title').value = '';
        document.getElementById('pdf-urls').value = '';
    } catch(e) { console.error("Error: ", e); alert("Failed to add"); }
});

// 3. Add Announcement
document.getElementById('btn-add-ann').addEventListener('click', async () => {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    
    if(!title || !text) return alert("Title and Message required!");

    try {
        await addDoc(collection(db, "announcements"), {
            title, text, date: new Date().toLocaleDateString(), timestamp: Date.now()
        });
        alert("Announcement Added to Firebase!");
        document.getElementById('ann-title').value = '';
        document.getElementById('ann-text').value = '';
    } catch(e) { console.error("Error: ", e); alert("Failed to add"); }
});

// 4. Add Banner
document.getElementById('btn-add-banner').addEventListener('click', async () => {
    const imgUrl = document.getElementById('banner-img').value;
    const linkUrl = document.getElementById('banner-link').value;
    
    if(!imgUrl) return alert("Banner Image URL required!");

    try {
        await addDoc(collection(db, "banners"), {
            imgUrl, linkUrl, timestamp: Date.now()
        });
        alert("Banner Added to Firebase!");
        document.getElementById('banner-img').value = '';
        document.getElementById('banner-link').value = '';
    } catch(e) { console.error("Error: ", e); alert("Failed to add"); }
});


// ================= FIREBASE REAL-TIME LISTENERS (Fetch Data) =================
function listenToData() {
    
    // Listen to Banners
    const qBanners = query(collection(db, "banners"), orderBy("timestamp", "desc"));
    onSnapshot(qBanners, (snapshot) => {
        const container = document.getElementById('banner-container');
        if(snapshot.empty) {
            container.style.display = 'none';
        } else {
            container.style.display = 'flex';
            let html = '';
            snapshot.forEach(doc => {
                const b = doc.data();
                html += `<a href="${b.linkUrl || '#'}" class="banner" target="${b.linkUrl ? '_blank' : '_self'}">
                            <img src="${b.imgUrl}" alt="Banner">
                         </a>`;
            });
            container.innerHTML = html;
        }
    });

    // Listen to Classes
    const qClasses = query(collection(db, "classes"), orderBy("timestamp", "desc"));
    onSnapshot(qClasses, (snapshot) => {
        const container = document.getElementById('classes-list');
        if(snapshot.empty) container.innerHTML = '<div class="empty-msg">No classes scheduled yet.</div>';
        else {
            let html = '';
            snapshot.forEach(doc => {
                const c = doc.data();
                // "allowfullscreen" is properly added here for rotation/full screen on mobile
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
            });
            container.innerHTML = html;
        }
    });

    // Listen to PDFs (Notes)
    const qPdfs = query(collection(db, "pdfs"), orderBy("timestamp", "desc"));
    onSnapshot(qPdfs, (snapshot) => {
        const container = document.getElementById('pdfs-list');
        if(snapshot.empty) container.innerHTML = '<div class="empty-msg">No notes available.</div>';
        else {
            let html = '';
            snapshot.forEach(doc => {
                const p = doc.data();
                html += `
                    <div class="card">
                        <h3 class="card-title">📄 ${p.title}</h3>
                        <div class="pdf-images">
                            ${p.images.map(img => `<img src="${img}" alt="Page" loading="lazy">`).join('')}
                        </div>
                    </div>`;
            });
            container.innerHTML = html;
        }
    });

    // Listen to Announcements
    const qAnns = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
    onSnapshot(qAnns, (snapshot) => {
        const container = document.getElementById('announcements-list');
        if(snapshot.empty) container.innerHTML = '<div class="empty-msg">No recent announcements.</div>';
        else {
            let html = '';
            snapshot.forEach(doc => {
                const a = doc.data();
                html += `
                    <div class="card">
                        <h3 class="card-title">📢 ${a.title}</h3>
                        <div class="ann-text">${a.text}</div>
                        <span class="ann-date">Posted on: ${a.date}</span>
                    </div>`;
            });
            container.innerHTML = html;
        }
    });
}
