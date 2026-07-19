// ================= SPLASH SCREEN & PARTICLES =================
document.addEventListener("DOMContentLoaded", () => {
    // Generate particles
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

    // Hide Splash after 4.5 seconds and show main app
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            loadAllData(); // Load data from localStorage
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

document.getElementById('cancel-pin').addEventListener('click', () => {
    pinModal.style.display = 'none';
});

document.getElementById('submit-pin').addEventListener('click', () => {
    if(pinInput.value === '7890') {
        pinModal.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        alert("Incorrect PIN!");
        pinInput.value = '';
    }
});

document.getElementById('close-admin').addEventListener('click', () => {
    adminPanel.style.display = 'none';
    loadAllData(); // Refresh UI after changes
});

// ================= DATA MANAGEMENT (LocalStorage) =================

// Utility to convert standard YT url to embed url
function getYouTubeEmbedUrl(url) {
    let videoId = "";
    if(url.includes('v=')) {
        videoId = url.split('v=')[1].substring(0, 11);
    } else if(url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].substring(0, 11);
    }
    // rel=0 ensures only videos from the same channel are suggested at the end
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
}

// 1. Add Class
function addClass() {
    const title = document.getElementById('class-title').value;
    const url = document.getElementById('class-url').value;
    const date = document.getElementById('class-date').value;
    const start = document.getElementById('class-start').value;
    const end = document.getElementById('class-end').value;

    const embedUrl = getYouTubeEmbedUrl(url);
    
    if(!title || !embedUrl) return alert("Title & Valid YouTube URL required!");

    const newClass = { id: Date.now(), title, embedUrl, date, start, end };
    const classes = JSON.parse(localStorage.getItem('app_classes') || '[]');
    classes.unshift(newClass);
    localStorage.setItem('app_classes', JSON.stringify(classes));
    
    alert("Class Added Successfully!");
    document.getElementById('class-title').value = '';
    document.getElementById('class-url').value = '';
}

// 2. Add PDF (Images)
function addPdf() {
    const title = document.getElementById('pdf-title').value;
    const urlsRaw = document.getElementById('pdf-urls').value;
    
    if(!title || !urlsRaw) return alert("Title and at least one Image URL required!");

    // Split by comma or newline, trim spaces, remove empties
    const imgArray = urlsRaw.split(/[\n,]+/).map(u => u.trim()).filter(u => u !== "");

    const newPdf = { id: Date.now(), title, images: imgArray };
    const pdfs = JSON.parse(localStorage.getItem('app_pdfs') || '[]');
    pdfs.unshift(newPdf);
    localStorage.setItem('app_pdfs', JSON.stringify(pdfs));

    alert("PDF (Images) Added Successfully!");
    document.getElementById('pdf-title').value = '';
    document.getElementById('pdf-urls').value = '';
}

// 3. Add Announcement
function addAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    
    if(!title || !text) return alert("Title and Message required!");

    const newAnn = { id: Date.now(), title, text, date: new Date().toLocaleDateString() };
    const anns = JSON.parse(localStorage.getItem('app_anns') || '[]');
    anns.unshift(newAnn);
    localStorage.setItem('app_anns', JSON.stringify(anns));

    alert("Announcement Added!");
    document.getElementById('ann-title').value = '';
    document.getElementById('ann-text').value = '';
}

// 4. Add Banner
function addBanner() {
    const imgUrl = document.getElementById('banner-img').value;
    const linkUrl = document.getElementById('banner-link').value;
    
    if(!imgUrl) return alert("Banner Image URL required!");

    const newBanner = { id: Date.now(), imgUrl, linkUrl };
    const banners = JSON.parse(localStorage.getItem('app_banners') || '[]');
    banners.unshift(newBanner);
    localStorage.setItem('app_banners', JSON.stringify(banners));

    alert("Banner Added!");
    document.getElementById('banner-img').value = '';
    document.getElementById('banner-link').value = '';
}

// Clear All
function clearAllData() {
    if(confirm("Are you sure? This will delete all classes, PDFs, and banners!")) {
        localStorage.clear();
        alert("All data cleared!");
        loadAllData();
    }
}

// ================= RENDER UI =================
function loadAllData() {
    
    // 1. Render Banners
    const banners = JSON.parse(localStorage.getItem('app_banners') || '[]');
    const bannerContainer = document.getElementById('banner-container');
    if(banners.length === 0) {
        bannerContainer.style.display = 'none';
    } else {
        bannerContainer.style.display = 'flex';
        bannerContainer.innerHTML = banners.map(b => `
            <a href="${b.linkUrl || '#'}" class="banner" target="${b.linkUrl ? '_blank' : '_self'}">
                <img src="${b.imgUrl}" alt="Banner">
            </a>
        `).join('');
    }

    // 2. Render Classes
    const classes = JSON.parse(localStorage.getItem('app_classes') || '[]');
    const classContainer = document.getElementById('classes-list');
    if(classes.length === 0) classContainer.innerHTML = '<div class="empty-msg">No classes scheduled yet.</div>';
    else {
        classContainer.innerHTML = classes.map(c => `
            <div class="card">
                <h3 class="card-title">${c.title}</h3>
                <div class="video-wrapper">
                    <iframe src="${c.embedUrl}" allowfullscreen></iframe>
                </div>
                <div class="class-meta">
                    ${c.date ? `<span>📅 ${c.date}</span>` : ''}
                    ${c.start ? `<span>🟢 Live: ${c.start}</span>` : ''}
                    ${c.end ? `<span>🔴 Ended: ${c.end}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // 3. Render PDFs
    const pdfs = JSON.parse(localStorage.getItem('app_pdfs') || '[]');
    const pdfContainer = document.getElementById('pdfs-list');
    if(pdfs.length === 0) pdfContainer.innerHTML = '<div class="empty-msg">No PDFs available.</div>';
    else {
        pdfContainer.innerHTML = pdfs.map(p => `
            <div class="card">
                <h3 class="card-title">📄 ${p.title}</h3>
                <div class="pdf-images">
                    ${p.images.map(img => `<img src="${img}" alt="Page" loading="lazy">`).join('')}
                </div>
            </div>
        `).join('');
    }

    // 4. Render Announcements
    const anns = JSON.parse(localStorage.getItem('app_anns') || '[]');
    const annContainer = document.getElementById('announcements-list');
    if(anns.length === 0) annContainer.innerHTML = '<div class="empty-msg">No recent announcements.</div>';
    else {
        annContainer.innerHTML = anns.map(a => `
            <div class="card">
                <h3 class="card-title">📢 ${a.title}</h3>
                <div class="ann-text">${a.text}</div>
                <span class="ann-date">Posted on: ${a.date}</span>
            </div>
        `).join('');
    }
}
