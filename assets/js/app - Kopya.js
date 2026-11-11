let db = null;
let map = null;
let allArticles = [];
let currentMode = 'encyclopedia';
let viewType = 'AZ';
let selectedLetter = 'ALL';

const CATEGORY_ORDER = [
    'hayatta-kalma',
    'yasami-devam-ettirme',
    'medeniyete-gecis'
];

const CATEGORY_LABELS = {
    'hayatta-kalma': '1. Hayatta Kalma (İlk 72 Saat)',
    'yasami-devam-ettirme': '2. Yaşamı Devam Ettirme',
    'medeniyete-gecis': '3. Medeniyete Geçiş'
};

function getCategoryWeight(cat) {
    if (!cat) return 99;
    const base = cat.split('/')[0].toLowerCase().trim();
    const idx = CATEGORY_ORDER.indexOf(base);
    return idx !== -1 ? idx : 50;
}

function formatCategoryTitle(cat) {
    if (!cat) return 'Genel';
    const base = cat.split('/')[0].toLowerCase().trim();
    return CATEGORY_LABELS[base] || cat;
}

initSqlJs({ locateFile: function(f) { return './assets/js/' + f; } }).then(async function(SQL) {
    try {
        const res = await fetch('./data/database.sqlite');
        if (!res.ok) throw new Error("Veritabanı dosyası bulunamadı.");
        const buf = await res.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buf));
        loadAllArticles();
    } catch (err) {
        console.error(err);
        document.getElementById('content-area').innerHTML = '<div style="background:#fee2e2; color:#991b1b; padding:16px; border-radius:8px;">⚠️ Veritabanı yüklenemedi: ' + err.message + '</div>';
    }
});

function loadAllArticles() {
    const stmt = db.prepare("SELECT * FROM articles ORDER BY title ASC");
    allArticles = [];
    const categories = new Set();

    while (stmt.step()) {
        const row = stmt.getAsObject();
        const lower = (row.content || '').toLowerCase();
        if (lower.includes('yüksek') || lower.includes('ölümcül')) {
            row.riskLevel = 'Yüksek';
        } else if (lower.includes('orta')) {
            row.riskLevel = 'Orta';
        } else {
            row.riskLevel = 'Düşük';
        }
        row.readTime = Math.max(1, Math.ceil((row.content || '').split(' ').length / 180)) + " dk";
        allArticles.push(row);
        if (row.category) categories.add(row.category);
    }

    const catSelect = document.getElementById('filterCategory');
    catSelect.innerHTML = '<option value="ALL">Hepsi</option>';
    const sortedCats = Array.from(categories).sort(function(a, b) {
        const wA = getCategoryWeight(a);
        const wB = getCategoryWeight(b);
        if (wA !== wB) return wA - wB;
        return a.localeCompare(b, 'tr');
    });
    sortedCats.forEach(function(c) {
        catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>';
    });

    buildAlphabetBar();
    applyAllFilters();
}

function buildAlphabetBar() {
    const bar = document.getElementById('alpha-bar');
    const letterSet = new Set();
    allArticles.forEach(function(a) {
        if (a.title) letterSet.add(a.title.charAt(0).toUpperCase());
    });
    const letters = Array.from(letterSet).sort(function(a, b) { return a.localeCompare(b, 'tr'); });
    
    let html = '<button class="alpha-btn active" data-letter="ALL">Tümü</button>';
    letters.forEach(function(l) {
        html += '<button class="alpha-btn" data-letter="' + l + '">' + l + '</button>';
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.alpha-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            bar.querySelectorAll('.alpha-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedLetter = btn.getAttribute('data-letter');
            applyAllFilters();
        });
    });
}

function applyAllFilters() {
    const catVal = document.getElementById('filterCategory').value;
    const riskVal = document.getElementById('filterRisk').value;
    const phaseVal = document.getElementById('filterPhase').value;

    const filtered = allArticles.filter(function(a) {
        const matchCat = catVal === 'ALL' || a.category === catVal;
        const matchRisk = riskVal === 'ALL' || a.riskLevel === riskVal;
        const matchPhase = phaseVal === 'ALL' || (a.category && a.category.indexOf(phaseVal) !== -1);
        const matchLetter = selectedLetter === 'ALL' || a.title.toUpperCase().startsWith(selectedLetter);
        return matchCat && matchRisk && matchPhase && matchLetter;
    });

    document.getElementById('cardCountText').innerText = filtered.length + ' kart';
    renderCards(filtered);
}

function renderCards(articles) {
    const area = document.getElementById('content-area');
    if (articles.length === 0) {
        area.innerHTML = '<p style="padding:20px; text-align:center; color:#6b7280;">Seçili filtrelere uygun kayıt bulunamadı.</p>';
        return;
    }

    if (viewType === 'CAT') {
        const groups = {};
        articles.forEach(function(row) {
            const baseCat = (row.category || 'Genel').split('/')[0].trim();
            if (!groups[baseCat]) groups[baseCat] = [];
            groups[baseCat].push(row);
        });

        const sortedGroupKeys = Object.keys(groups).sort(function(a, b) {
            const wA = getCategoryWeight(a);
            const wB = getCategoryWeight(b);
            if (wA !== wB) return wA - wB;
            return a.localeCompare(b, 'tr');
        });

        let html = '';
        sortedGroupKeys.forEach(function(key, index) {
            const groupItems = groups[key].sort(function(a, b) {
                return a.title.localeCompare(b.title, 'tr');
            });
            const displayTitle = formatCategoryTitle(key);
            const groupId = 'cat-group-' + index;

            html += '<div class="cat-section" style="margin-top: 18px;">' +
                '<div class="cat-header" data-target="' + groupId + '" style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid #d1d5db; padding:12px 16px; border-radius:10px; cursor:pointer; user-select:none;">' +
                    '<div style="display:flex; align-items:center; gap:10px;">' +
                        '<span class="cat-arrow" style="color:#2d5a27; font-size:13px;">▼</span>' +
                        '<strong style="color:#2d5a27; font-size:16px;">' + displayTitle + '</strong>' +
                    '</div>' +
                    '<span style="background:#dcfce7; color:#166534; font-size:12px; font-weight:700; padding:3px 10px; border-radius:999px;">' + groupItems.length + ' rehber</span>' +
                '</div>' +
                '<div id="' + groupId + '" class="cat-body" style="padding-top:10px; padding-left:6px;">';

            groupItems.forEach(function(row) {
                html += '<div class="article-card" data-id="' + row.id + '">' +
                    '<div class="card-title">' + row.title + '</div>' +
                    '<div class="card-badges">' +
                        '<span class="badge b-risk">' + row.riskLevel + ' risk</span>' +
                        '<span class="badge b-cat">' + (row.category || 'Genel') + '</span>' +
                        '<span class="badge b-time">⏱️ ' + row.readTime + '</span>' +
                    '</div>' +
                '</div>';
            });

            html += '</div></div>';
        });

        area.innerHTML = html;

        area.querySelectorAll('.cat-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const targetId = header.getAttribute('data-target');
                const bodyEl = document.getElementById(targetId);
                const arrowEl = header.querySelector('.cat-arrow');
                if (!bodyEl) return;

                if (bodyEl.style.display === 'none') {
                    bodyEl.style.display = 'block';
                    if (arrowEl) arrowEl.innerText = '▼';
                } else {
                    bodyEl.style.display = 'none';
                    if (arrowEl) arrowEl.innerText = '▶';
                }
            });
        });

    } else {
        let html = '';
        let currentGroup = '';

        const sorted = articles.slice().sort(function(a, b) {
            return a.title.localeCompare(b.title, 'tr');
        });

        sorted.forEach(function(row) {
            const groupHeader = row.title.charAt(0).toUpperCase();
            if (groupHeader !== currentGroup) {
                currentGroup = groupHeader;
                html += '<h3 style="margin: 22px 0 10px; color: #2d5a27; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">' + currentGroup + '</h3>';
            }

            html += '<div class="article-card" data-id="' + row.id + '">' +
                '<div class="card-title">' + row.title + '</div>' +
                '<div class="card-badges">' +
                    '<span class="badge b-risk">' + row.riskLevel + ' risk</span>' +
                    '<span class="badge b-cat">' + (row.category || 'Genel') + '</span>' +
                    '<span class="badge b-time">⏱️ ' + row.readTime + '</span>' +
                '</div>' +
            '</div>';
        });

        area.innerHTML = html;
    }

    area.querySelectorAll('.article-card').forEach(function(card) {
        card.addEventListener('click', function() {
            openReader(Number(card.getAttribute('data-id')));
        });
    });
}

function openReader(id) {
    const article = allArticles.find(function(a) { return a.id === id; });
    if (!article) return;

    document.getElementById('directory-header').style.display = 'none';
    const area = document.getElementById('content-area');
    const contentHtml = typeof marked !== 'undefined' ? marked.parse(article.content) : '<pre style="white-space:pre-wrap;">' + article.content + '</pre>';

    area.innerHTML = '<button class="btn" id="backDirBtn" style="margin-bottom: 16px;">← Ansiklopediye Dön</button>' +
        '<div class="reader-box">' +
            '<div style="margin-bottom: 14px; display:flex; gap:8px;">' +

'' + article.riskLevel + ' risk' +
'' + article.category + '' +
'' +
contentHtml +
'';
document.getElementById('backDirBtn').addEventListener('click', resetToHome);
window.scrollTo({ top: 0, behavior: 'smooth' });
}
function resetToHome(e) {
if (e) e.preventDefault();
currentMode = 'encyclopedia';
selectedLetter = 'ALL';
document.getElementById('searchInput').value = '';
document.getElementById('filterCategory').value = 'ALL';
document.getElementById('filterRisk').value = 'ALL';
document.getElementById('filterPhase').value = 'ALL';
document.getElementById('modeEncyclopediaBtn').classList.add('btn-active');
document.getElementById('modeAiBtn').classList.remove('btn-active');
document.getElementById('searchInput').placeholder = 'Ara: ateş, kene, patates, su arıtma...';
document.querySelectorAll('.alpha-btn').forEach(function(b) { b.classList.remove('active'); });
const allBtn = document.querySelector('.alpha-btn[data-letter="ALL"]');
if (allBtn) allBtn.classList.add('active');
document.getElementById('directory-header').style.display = 'block';
applyAllFilters();
}
document.getElementById('homeBrandBtn').addEventListener('click', resetToHome);
document.getElementById('modeEncyclopediaBtn').addEventListener('click', resetToHome);
document.getElementById('applyFiltersBtn').addEventListener('click', applyAllFilters);
document.getElementById('viewAZBtn').addEventListener('click', function(e) {
viewType = 'AZ';
e.target.classList.add('active');
document.getElementById('viewCatBtn').classList.remove('active');
document.getElementById('alpha-bar').style.display = 'flex';
applyAllFilters();
});
document.getElementById('viewCatBtn').addEventListener('click', function(e) {
viewType = 'CAT';
e.target.classList.add('active');
document.getElementById('viewAZBtn').classList.remove('active');
document.getElementById('alpha-bar').style.display = 'none';
applyAllFilters();
});
document.getElementById('modeAiBtn').addEventListener('click', function(e) {
currentMode = 'ai';
e.target.classList.add('btn-active');
document.getElementById('modeEncyclopediaBtn').classList.remove('btn-active');
document.getElementById('directory-header').style.display = 'none';
const input = document.getElementById('searchInput');
input.placeholder = "Danışman AI'a sor: patates yenir mi, su nasıl arıtılır...";
input.focus();
document.getElementById('content-area').innerHTML =
'' +
'🧠 AVS Çevrimdışı Danışman (AI)' +
'İnternet bağlantısı olmadan veritabanındaki tüm teknik kılavuzları tarayarak doğrudan yanıt üretir. Yukarıdaki arama çubuğuna sorunuzu yazıp Ara butonuna basın.' +
'' +
'Örnek: "yeşil patates yenir mi"' +
'Örnek: "su nasıl arıtılır"' +
'Örnek: "acı badem zehirler mi"' +
'' +
'';
document.querySelectorAll('.quick-q').forEach(function(btn) {
btn.addEventListener('click', function() {
document.getElementById('searchInput').value = btn.getAttribute('data-q');
executeSearch();
});
});
});
document.getElementById('toggleMapBtn').addEventListener('click', function() {
const mapDiv = document.getElementById('map-area');
if (mapDiv.style.display === 'none' || mapDiv.style.display === '') {
mapDiv.style.display = 'block';
if (!map) {
map = L.map('map-area').setView([39.9334, 32.8597], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
}
map.invalidateSize();
} else {
mapDiv.style.display = 'none';
}
});
function extractKeywords(query) {
const stopWords = ["ve", "veya", "ile", "için", "bir", "bu", "şu", "nasıl", "nedir", "neler", "ne", "zaman", "mi", "mı", "mu", "mü", "yenir", "yapılır", "edilir"];
return query.toLowerCase()
.replace(/[^\w\sğüşıöç]/g, '')
.split(/\s+/)
.filter(function(w) { return w.length > 2 && stopWords.indexOf(w) === -1; })
.map(function(w) { return w.slice(0, 5); });
}
function executeSearch() {
    const inputEl = document.getElementById('searchInput');
    const rawQuery = inputEl ? inputEl.value.trim() : '';
    if (!rawQuery) { 
        resetToHome(); 
        return; 
    }

    const dirHeader = document.getElementById('directory-header');
    if (dirHeader) dirHeader.style.display = 'none';

    const keywords = extractKeywords(rawQuery);
    const searchTerms = keywords.length > 0 ? keywords : [rawQuery.toLowerCase()];

    const scoredResults = allArticles.map(function(art) {
        let score = 0;
        const titleLower = (art.title || '').toLowerCase();
        const contentLower = (art.content || '').toLowerCase();

        searchTerms.forEach(function(term) {
            if (titleLower.indexOf(term) !== -1) score += 15;
            if (contentLower.indexOf(term) !== -1) score += 3;
        });
        return { article: art, score: score };
    }).filter(function(item) { return item.score > 0; }).sort(function(a, b) { return b.score - a.score; });

    const results = scoredResults.map(function(s) { return s.article; });
    const area = document.getElementById('content-area');
    if (!area) return;

    let html = '<button class="btn" id="searchBackBtn" style="margin-bottom: 16px;">← Ansiklopediye Dön</button>';

    if (results.length === 0) {
        area.innerHTML = html + '<div class="reader-box"><p>"<b>' + rawQuery + '</b>" sorgusuyla eşleşen bir kayıt bulunamadı.</p></div>';
        const backBtnEmpty = document.getElementById('searchBackBtn');
        if (backBtnEmpty) backBtnEmpty.addEventListener('click', resetToHome);
        return;
    }

    if (currentMode === 'ai') {
        const matchedLines = [];
        const warningLines = [];

        results.slice(0, 3).forEach(function(art) {
            (art.content || '').split('\n').forEach(function(line) {
                const trimmed = line.trim();
                if (trimmed.startsWith('---') || trimmed.startsWith('baslik:') || trimmed.startsWith('etiketler:')) return;
                
                const clean = trimmed.replace(/<[^>]*>/g, ' ').replace(/[*#`_\-|]/g, ' ').replace(/\s+/g, ' ').trim();
                if (clean.length < 20 || clean.length > 260) return;
                const cleanLower = clean.toLowerCase();

                const isMatch = searchTerms.some(function(term) { return cleanLower.indexOf(term) !== -1; });
                if (isMatch) {
                    if (cleanLower.indexOf('uyarı') !== -1 || cleanLower.indexOf('zehir') !== -1 || cleanLower.indexOf('ölümcül') !== -1 || cleanLower.indexOf('dikkat') !== -1 || cleanLower.indexOf('yenmez') !== -1) {
                        if (warningLines.length < 3 && warningLines.indexOf(clean) === -1) warningLines.push(clean);
                    } else {
                        if (matchedLines.length < 6 && matchedLines.indexOf(clean) === -1) matchedLines.push('<b>[' + art.title.split(' ')[0] + ']</b> ' + clean);
                    }
                }
            });
        });

        html += '<div style="background:#ffffff; border:2px solid #2d5a27; padding:18px; border-radius:12px; margin-bottom:20px; box-shadow:0 2px 6px rgba(0,0,0,0.05);">' +
            '<h3 style="color:#2d5a27; margin-bottom:10px; font-size:17px;">🧠 Danışman (AI) Triyaj Yanıtı: "' + rawQuery + '"</h3>';
        
        if (warningLines.length > 0) {
            html += '<div style="background:#fef2f2; border-left:4px solid #dc2626; padding:12px; margin-bottom:14px; color:#991b1b; border-radius:4px;">' +
                '<strong>⚠️ Kritik Uyarı ve Riskler:</strong>' +
                '<ul style="margin-top:6px; padding-left:18px;">' + warningLines.map(function(w) { return '<li style="margin-bottom:4px;">' + w + '</li>'; }).join('') + '</ul></div>';
        }
        
        html += '<div><strong>📋 Teknik Bilgiler ve Uygulama Adımları:</strong><ul style="margin-top:8px; padding-left:20px; color:#1f2937;">' +
            (matchedLines.length > 0 ? matchedLines.map(function(m) { return '<li style="margin-bottom:6px;">' + m + '</li>'; }).join('') : '<li>Doğrudan ilgili teknik kılavuzlar aşağıda listelenmiştir.</li>') +
            '</ul></div></div>';
    }

    results.forEach(function(row) {
        html += '<div class="article-card" data-id="' + row.id + '">' +
            '<div class="card-title">' + row.title + '</div>' +
            '<div class="card-badges">' +
                '<span class="badge b-risk">' + row.riskLevel + ' risk</span>' +
                '<span class="badge b-cat">' + (row.category || 'Genel') + '</span>' +
                '<span class="badge b-time">⏱️ ' + row.readTime + '</span>' +
            '</div>' +
        '</div>';
    });

    area.innerHTML = html;

    const backBtn = document.getElementById('searchBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', resetToHome);
    }

    area.querySelectorAll('.article-card').forEach(function(card) {
        card.addEventListener('click', function() {
            openReader(Number(card.getAttribute('data-id')));
        });
    });
}

const sBtn = document.getElementById('searchBtn');
if (sBtn) sBtn.addEventListener('click', executeSearch);
const sInp = document.getElementById('searchInput');
if (sInp) {
sInp.addEventListener('keypress', function(e) {
if (e.key === 'Enter') executeSearch();
});
}