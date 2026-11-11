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

window.addEventListener('DOMContentLoaded', function() {
    if (window.OFFLINE_ARTICLES && Array.isArray(window.OFFLINE_ARTICLES)) {
        loadAllArticles();
    } else {
        document.getElementById('content-area').innerHTML = '<div style="background:#fee2e2; color:#991b1b; padding:16px; border-radius:8px;">⚠️ Veri dosyası (articles_data.js) yüklenemedi.</div>';
    }
});

function loadAllArticles() {
    allArticles = [];
    const categories = new Set();

    window.OFFLINE_ARTICLES.forEach(function(row) {
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
    });

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
                '<span class="badge b-risk">' + article.riskLevel + ' risk</span>' +
                '<span class="badge b-cat">' + (article.category || 'Genel') + '</span>' +
            '</div>' +
            contentHtml +
        '</div>';

    document.getElementById('backDirBtn').addEventListener('click', resetToHome);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetToHome(e) {
    if (e) e.preventDefault();
    currentMode = 'encyclopedia';
    selectedLetter = 'ALL';
    document.getElementById('pharma-header').style.display = 'none';
    document.getElementById('modePharmaBtn').classList.remove('btn-active');
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
    document.getElementById('pharma-header').style.display = 'none';
    document.getElementById('modePharmaBtn').classList.remove('btn-active');
    document.getElementById('modeEncyclopediaBtn').classList.remove('btn-active');
    document.getElementById('directory-header').style.display = 'none';
    const input = document.getElementById('searchInput');
    input.placeholder = "Danışman AI'a sor: patates yenir mi, su nasıl arıtılır...";
    input.focus();

    document.getElementById('content-area').innerHTML =
        '<div style="background:#ffffff; border:1px solid #e5e7eb; padding:24px; border-radius:12px;">' +
            '<h2 style="color:#2d5a27; margin-bottom:10px;">🧠 AVS Çevrimdışı Danışman (AI)</h2>' +
            '<p style="color:#4b5563; margin-bottom:16px;">İnternet bağlantısı olmadan veritabanındaki tüm teknik kılavuzları tarayarak doğrudan yanıt üretir. Yukarıdaki arama çubuğuna sorunuzu yazıp <b>Ara</b> butonuna basın.</p>' +
            '<div style="display:flex; flex-wrap:wrap; gap:8px;">' +
                '<button class="pill-btn quick-q" data-q="yeşil patates yenir mi">Örnek: "yeşil patates yenir mi"</button>' +
                '<button class="pill-btn quick-q" data-q="su nasıl arıtılır">Örnek: "su nasıl arıtılır"</button>' +
                '<button class="pill-btn quick-q" data-q="acı badem zehirler mi">Örnek: "acı badem zehirler mi"</button>' +
            '</div>' +
        '</div>';

    document.querySelectorAll('.quick-q').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('searchInput').value = btn.getAttribute('data-q');
            executeSearch();
        });
    });
});
let guideLines = [];

// İki koordinat arası kuş uçuşu mesafe (km)
function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// İki koordinat arası 8 yönlü pusula yönü (Kuzey, Güneybatı vb.)
function calcDirectionTr(lat1, lon1, lat2, lon2) {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    let brng = Math.atan2(y, x) * 180 / Math.PI;
    brng = (brng + 360) % 360;

    const dirs = ["Kuzey", "Kuzeydoğu", "Doğu", "Güneydoğu", "Güney", "Güneybatı", "Batı", "Kuzeybatı"];
    const index = Math.round(brng / 45) % 8;
    return dirs[index];
}

let currentPin = null;
let rangeCircles = [];
let lastClickedCoords = '';

function initMapEngine(pmtilesSource) {
    if (map) {
        map.remove();
        map = null;
    }

    map = L.map('map-area').setView([41.0082, 28.9784], 9);

    const protoLib = window.protomapsL || window.protomapsLeaflet;

        if (pmtilesSource && protoLib) {
        // Modern ve Göz Yormayan Kartografya Renkleri
        const paintRules = [
            { dataLayer: "ocean", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#aadaff" }) },
            { dataLayer: "water_polygons", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#aadaff" }) },
            { dataLayer: "water_lines", symbolizer: new protoLib.LineSymbolizer({ color: "#7cc4fa", width: 2 }) },
            { dataLayer: "dam_polygons", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#cbd5e1" }) },
            { dataLayer: "land", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#d8efd3" }) },
            { dataLayer: "sites", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#e6f4ea" }) },
            { dataLayer: "streets", symbolizer: new protoLib.LineSymbolizer({ color: "#cbd5e1", width: 2.5 }) },
            { dataLayer: "streets", symbolizer: new protoLib.LineSymbolizer({ color: "#ffffff", width: 1.5 }) },
            { dataLayer: "street_polygons", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#f1f5f9" }) },
            { dataLayer: "bridges", symbolizer: new protoLib.LineSymbolizer({ color: "#94a3b8", width: 3 }) },
            { dataLayer: "ferries", symbolizer: new protoLib.LineSymbolizer({ color: "#3b82f6", width: 1, dash: [4, 4] }) },
            { dataLayer: "railways", symbolizer: new protoLib.LineSymbolizer({ color: "#94a3b8", width: 1.5, dash: [3, 3] }) },
            { dataLayer: "buildings", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#e2e8f0", stroke: "#cbd5e1", width: 0.5 }) },
            { dataLayer: "boundaries", symbolizer: new protoLib.LineSymbolizer({ color: "#94a3b8", width: 1, dash: [5, 5] }) }
        ];

        const labelRules = [
            {
                dataLayer: "place_labels",
                symbolizer: new protoLib.CenteredTextSymbolizer({
                    labelProps: ["name:tr", "name"],
                    fill: "#1e293b",
                    stroke: "#ffffff",
                    width: 2.5,
                    font: "700 13px sans-serif"
                })
            },
            {
                dataLayer: "street_labels",
                symbolizer: new protoLib.LineLabelSymbolizer({
                    labelProps: ["name:tr", "name"],
                    fill: "#475569",
                    stroke: "#ffffff",
                    width: 2,
                    font: "500 11px sans-serif"
                })
            },
            {
                dataLayer: "water_lines_labels",
                symbolizer: new protoLib.LineLabelSymbolizer({
                    labelProps: ["name:tr", "name"],
                    fill: "#0284c7",
                    stroke: "#ffffff",
                    width: 2,
                    font: "600 11px sans-serif"
                })
            }
        ];

        const pmObj = (typeof pmtilesSource === 'string') ? new pmtiles.PMTiles(pmtilesSource) : pmtilesSource;

        // Haritanın maksimum veri zoom seviyesini okuyarak sokak detayında grileşmeyi (overzoom) engelle
        const setupLayer = function(maxZoomVal) {
             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                maxZoom: 19,
                opacity: 0.85
            }).addTo(map);
            const layer = protoLib.leafletLayer({
                url: pmObj,
                paintRules: paintRules,
                labelRules: labelRules,
                maxDataZoom: maxZoomVal || 14
            });
            layer.addTo(map);
            
            // Sol alt köşeye kaç km / metre olduğunu gösteren ölçek çubuğu ekle
            L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);
            document.getElementById('mapStatusText').innerHTML = '<span style="color:#166534;">✅ Çevrimdışı Harita Aktif</span>';
        };

        if (pmObj && typeof pmObj.getHeader === 'function') {
            pmObj.getHeader().then(function(h) {
                setupLayer(h ? h.maxZoom : 14);
                if (h && h.centerLat && h.centerLon) {
                    map.setView([h.centerLat, h.centerLon], Math.max(h.minZoom || 8, h.centerZoom || 10));
                }
            }).catch(function() {
                setupLayer(14);
            });
        } else {
            setupLayer(14);
        }
    } else {


        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        document.getElementById('mapStatusText').innerHTML = '<span style="color:#b45309;">⚠️ Çevrimdışı .pmtiles seçilmedi</span>';
    }

    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        lastClickedCoords = lat + ', ' + lng;

        if (currentPin) map.removeLayer(currentPin);
        rangeCircles.forEach(function(c) { map.removeLayer(c); });
        rangeCircles = [];

        currentPin = L.circleMarker([lat, lng], {
            radius: 8, fillColor: '#dc2626', color: '#ffffff', weight: 2, opacity: 1, fillOpacity: 1
        }).addTo(map).bindPopup('<b>Seçilen Kamp / Keşif Noktası</b><br>Koordinat: ' + lastClickedCoords).openPopup();

        const c1 = L.circle([lat, lng], { radius: 1000, color: '#16a34a', weight: 2, fillOpacity: 0.08 }).addTo(map);
        const c5 = L.circle([lat, lng], { radius: 5000, color: '#ca8a04', weight: 1.5, dashArray: '5,5', fillOpacity: 0.04 }).addTo(map);
        const c15 = L.circle([lat, lng], { radius: 15000, color: '#dc2626', weight: 1.5, dashArray: '8,8', fillOpacity: 0.02 }).addTo(map);
        rangeCircles.push(c1, c5, c15);

        document.getElementById('coord-panel').style.display = 'block';
        document.getElementById('coordText').innerText = 'Enlem (Lat): ' + lat + '  |  Boylam (Lng): ' + lng;
                // Önceki yön çizgilerini temizle
        guideLines.forEach(function(line) { map.removeLayer(line); });
        guideLines = [];

        // En yakın 3 Su ve Orman kaynağını hesapla ve haritada kesikli çizgiyle göster
        const nearbyBox = document.getElementById('nearby-resources');
        if (nearbyBox && window.SURVIVAL_POIS) {
            const analyzed = window.SURVIVAL_POIS.map(function(poi) {
                const dist = calcDistanceKm(Number(lat), Number(lng), poi.lat, poi.lng);
                const dir = calcDirectionTr(Number(lat), Number(lng), poi.lat, poi.lng);
                return { poi: poi, dist: dist, dir: dir };
            }).sort(function(a, b) { return a.dist - b.dist; });

            const nearestWater = analyzed.filter(function(x) { return x.poi.type === 'su'; }).slice(0, 2);
            const nearestForest = analyzed.filter(function(x) { return x.poi.type === 'orman'; }).slice(0, 2);
            const topTargets = nearestWater.concat(nearestForest).sort(function(a, b) { return a.dist - b.dist; });

            let listHtml = '<div style="font-weight:700; color:#111827; font-size:13px; margin-bottom:6px;">🧭 Yakındaki Kritik Su ve Orman Kaynakları (Kuş Uçuşu):</div>';
            
            topTargets.forEach(function(item) {
                const icon = item.poi.type === 'su' ? '💧' : '🌲';
                const lineColor = item.poi.type === 'su' ? '#0284c7' : '#16a34a';
                const walkHours = (item.dist / 3.5).toFixed(1); // Ortalama arazi yürüyüş hızı 3.5 km/s

                listHtml += '<div style="font-size:12px; color:#1f2937; margin-bottom:5px; padding:5px 8px; background:#f8fafc; border-left:3px solid ' + lineColor + '; border-radius:4px;">' +
                    icon + ' <b>' + item.dir + ' yönünde ' + item.dist.toFixed(1) + ' km</b> — <b>' + item.poi.name + '</b> ' +
                    '<span style="color:#6b7280;">(' + item.poi.note + ' • Yürüyüş: ~' + walkHours + ' saat)</span>' +
                '</div>';

                // Harita üzerinde seçilen noktadan kaynağa kesikli yön çizgisi çiz
                const routeLine = L.polyline([[lat, lng], [item.poi.lat, item.poi.lng]], {
                    color: lineColor,
                    weight: 2,
                    dashArray: '6, 6',
                    opacity: 0.75
                }).addTo(map).bindTooltip(item.dir + ' ' + item.dist.toFixed(1) + ' km (' + item.poi.name + ')');
                guideLines.push(routeLine);
            });

            nearbyBox.innerHTML = listHtml;
        }

    });

}


document.getElementById('toggleMapBtn').addEventListener('click', function() {
    const wrapper = document.getElementById('map-wrapper');
    if (wrapper.style.display === 'none' || wrapper.style.display === '') {
        wrapper.style.display = 'block';
        if (!map) {
            initMapEngine('./maps/turkey.pmtiles');
        } else {
            map.invalidateSize();
        }
    } else {
        wrapper.style.display = 'none';
    }
});

const fileInput = document.getElementById('pmtilesFileInput');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const source = new pmtiles.PMTiles(new pmtiles.FileSource(file));
        initMapEngine(source);
        document.getElementById('mapStatusText').innerHTML = '<span style="color:#166534;">✅ Yüklendi: ' + file.name + '</span>';
    });
}

const copyBtn = document.getElementById('copyCoordBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', function() {
        if (!lastClickedCoords) return;
        navigator.clipboard.writeText(lastClickedCoords).then(function() {
            copyBtn.innerText = '✅ Kopyalandı!';
            setTimeout(function() { copyBtn.innerText = '📋 Koordinatı Kopyala'; }, 2000);
        });
    });
}


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

    const cleanWords = rawQuery.toLowerCase()
        .replace(/[^\w\sğüşıöç]/g, '')
        .split(/\s+/)
        .filter(function(w) { return w.length > 2; });
    
    const searchTerms = cleanWords.length > 0 ? cleanWords : [rawQuery.toLowerCase()];

    const scoredResults = allArticles.map(function(art) {
        let score = 0;
        const titleLower = (art.title || '').toLowerCase();
        const contentLower = (art.content || '').toLowerCase();

        searchTerms.forEach(function(term) {
            const root = term.length > 4 ? term.slice(0, -1) : term;
            if (titleLower.indexOf(root) !== -1) score += 20;
            if (contentLower.indexOf(root) !== -1) score += 3;
        });
        return { article: art, score: score };
    }).filter(function(item) { return item.score > 0; }).sort(function(a, b) { return b.score - a.score; });

    const results = scoredResults.map(function(s) { return s.article; });
    const area = document.getElementById('content-area');
    if (!area) return;

    area.innerHTML = '';

    // Geri Dön Butonu
    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.style.marginBottom = '16px';
    backBtn.innerText = '← Ansiklopediye Dön';
    backBtn.addEventListener('click', resetToHome);
    area.appendChild(backBtn);

    if (results.length === 0) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'reader-box';
        emptyBox.innerText = '"' + rawQuery + '" sorgusuyla eşleşen bir kayıt bulunamadı.';
        area.appendChild(emptyBox);
        return;
    }

    // Danışman (AI) Öneri Kutusu
    if (currentMode === 'ai') {
        const matchedLines = [];
        const warningLines = [];

        results.slice(0, 4).forEach(function(art) {
            const lines = (art.content || '').split('\n');
            lines.forEach(function(line) {
                const trimmed = line.trim();
                if (trimmed.startsWith('---') || trimmed.startsWith('baslik:') || trimmed.startsWith('etiketler:') || trimmed.startsWith('#')) return;
                
                const plain = trimmed.replace(/[*`_|\-]/g, ' ').replace(/\s+/g, ' ').trim();
                if (plain.length < 25 || plain.length > 240 || plain.indexOf('<') !== -1) return;
                
                const plainLower = plain.toLowerCase();
                const isMatch = searchTerms.some(function(term) {
                    const root = term.length > 4 ? term.slice(0, -1) : term;
                    return plainLower.indexOf(root) !== -1;
                });

                if (isMatch) {
                    const shortTitle = art.title.split(' ').slice(0, 2).join(' ');
                    const entryText = '[' + shortTitle + '] ' + plain;
                    if (plainLower.indexOf('uyarı') !== -1 || plainLower.indexOf('zehir') !== -1 || plainLower.indexOf('ölümcül') !== -1 || plainLower.indexOf('dikkat') !== -1) {
                        if (warningLines.length < 3 && warningLines.indexOf(entryText) === -1) warningLines.push(entryText);
                    } else {
                        if (matchedLines.length < 6 && matchedLines.indexOf(entryText) === -1) matchedLines.push(entryText);
                    }
                }
            });
        });

        const aiBox = document.createElement('div');
        aiBox.style.cssText = 'background:#ffffff; border:2px solid #2d5a27; padding:18px; border-radius:12px; margin-bottom:20px; box-shadow:0 2px 6px rgba(0,0,0,0.05);';

        const aiTitle = document.createElement('h3');
        aiTitle.style.cssText = 'color:#2d5a27; margin:0 0 12px 0; font-size:17px;';
        aiTitle.innerText = '🧠 Danışman (AI) Triyaj Yanıtı: "' + rawQuery + '"';
        aiBox.appendChild(aiTitle);

        if (warningLines.length > 0) {
            const warnDiv = document.createElement('div');
            warnDiv.style.cssText = 'background:#fef2f2; border-left:4px solid #dc2626; padding:12px; margin-bottom:14px; color:#991b1b; border-radius:6px;';
            
            const warnHeader = document.createElement('strong');
            warnHeader.style.cssText = 'display:block; margin-bottom:6px;';
            warnHeader.innerText = '⚠️ Kritik Uyarı ve Riskler:';
            warnDiv.appendChild(warnHeader);

            const warnUl = document.createElement('ul');
            warnUl.style.cssText = 'margin:0; padding-left:18px;';
            warningLines.forEach(function(w) {
                const li = document.createElement('li');
                li.style.marginBottom = '4px';
                li.innerText = w;
                warnUl.appendChild(li);
            });
            warnDiv.appendChild(warnUl);
            aiBox.appendChild(warnDiv);
        }

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0;';
        
        const infoHeader = document.createElement('strong');
        infoHeader.style.cssText = 'display:block; margin-bottom:8px; color:#111827;';
        infoHeader.innerText = '📋 Teknik Bilgiler ve Uygulama Adımları:';
        infoDiv.appendChild(infoHeader);

        const infoUl = document.createElement('ul');
        infoUl.style.cssText = 'margin:0; padding-left:18px; color:#1f2937;';
        
        if (matchedLines.length > 0) {
            matchedLines.forEach(function(m) {
                const li = document.createElement('li');
                li.style.cssText = 'margin-bottom:6px; line-height:1.4;';
                li.innerText = m;
                infoUl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerText = 'Aradığınız konuyla doğrudan ilgili teknik kılavuzlar aşağıda listelenmiştir.';
            infoUl.appendChild(li);
        }
        infoDiv.appendChild(infoUl);
        aiBox.appendChild(infoDiv);
        area.appendChild(aiBox);
    }
    // Danışman (AI) ve Ana Arama İçinde İlaç Eşleşmeleri
    if (window.PHARMA_DATA && Array.isArray(window.PHARMA_DATA)) {
        const matchedDrugs = window.PHARMA_DATA.filter(function(drug) {
            const hay = (drug.name + ' ' + (drug.brands || '') + ' ' + drug.usage + ' ' + drug.category).toLowerCase();
            return searchTerms.some(function(term) {
                const root = term.length > 4 ? term.slice(0, -1) : term;
                return hay.indexOf(root) !== -1;
            });
        }).slice(0, 4);

        matchedDrugs.forEach(function(drug) {
            const dCard = document.createElement('div');
            dCard.style.cssText = 'background:#f0fdf4; border:1px solid #16a34a; border-left:5px solid #15803d; border-radius:10px; padding:12px 16px; margin-bottom:12px;';
            dCard.innerHTML = '<div style="font-weight:800; color:#14532d; font-size:15px;">💊 İlaç Eşleşmesi: ' + drug.name + ' <span style="font-weight:400; font-size:12px;">(' + (drug.brands || drug.forms) + ')</span></div>' +
                '<div style="font-size:13px; color:#1f2937; margin-top:4px;"><b>Kullanım:</b> ' + drug.usage + '</div>' +
                '<div style="font-size:12px; color:#991b1b; margin-top:4px;"><b>⛔ Dikkat:</b> ' + drug.contra + '</div>';
            area.appendChild(dCard);
        });
    }

    // Eşleşen Makale Kartları
    results.forEach(function(row) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.addEventListener('click', function() { openReader(row.id); });

        const titleDiv = document.createElement('div');
        titleDiv.className = 'card-title';
        titleDiv.innerText = row.title;
        card.appendChild(titleDiv);

        const badgesDiv = document.createElement('div');
        badgesDiv.className = 'card-badges';

        const bRisk = document.createElement('span');
        bRisk.className = 'badge b-risk';
        bRisk.innerText = row.riskLevel + ' risk';
        badgesDiv.appendChild(bRisk);

        const bCat = document.createElement('span');
        bCat.className = 'badge b-cat';
        bCat.innerText = row.category || 'Genel';
        badgesDiv.appendChild(bCat);

        const bTime = document.createElement('span');
        bTime.className = 'badge b-time';
        bTime.innerText = '⏱️ ' + row.readTime;
        badgesDiv.appendChild(bTime);

        card.appendChild(badgesDiv);
        area.appendChild(card);
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
const updateBtn = document.getElementById('forceUpdateBtn');
if (updateBtn) {
    updateBtn.addEventListener('click', function() {
        // İnternet yoksa çevrimdışı verilerin silinmesini engelle
        if (!navigator.onLine) {
            alert('⚠️ İnternet bağlantınız yok! Mevcut çevrimdışı verileriniz korunuyor. Güncelleme için internete bağlanın.');
            return;
        }

        updateBtn.innerText = '⏳ Güncelleniyor...';
        updateBtn.disabled = true;

        if ('caches' in window) {
            caches.keys().then(function(names) {
                return Promise.all(names.map(function(name) {
                    return caches.delete(name);
                }));
            }).then(function() {
                window.location.reload(true);
            }).catch(function() {
                window.location.reload(true);
            });
        } else {
            window.location.reload(true);
        }
    });
}
// ==========================================
// FARMAKOLOJİ ANSİKLOPEDİSİ MODÜLÜ
// ==========================================
let pharmaSelectedLetter = 'ALL';

function initPharmaModule() {
    if (!window.PHARMA_DATA || !Array.isArray(window.PHARMA_DATA)) return;

    // Kategorileri doldur
    const catSelect = document.getElementById('pharmaCategoryFilter');
    if (catSelect) {
        const cats = Array.from(new Set(window.PHARMA_DATA.map(function(p) { return p.category; }))).sort(function(a, b) {
            return a.localeCompare(b, 'tr');
        });
        catSelect.innerHTML = '<option value="ALL">Tüm Kategoriler</option>';
        cats.forEach(function(c) {
            catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
    }

    // A-Z Harf Barını oluştur
    const bar = document.getElementById('pharma-alpha-bar');
    if (bar) {
        const letters = Array.from(new Set(
            window.PHARMA_DATA
                .filter(function(p) { return p && p.name && p.name.trim().length > 0; })
                .map(function(p) { return p.name.trim().charAt(0).toUpperCase(); })
        )).sort(function(a, b) { return a.localeCompare(b, 'tr'); });

        let html = '<button class="alpha-btn active" data-letter="ALL">Tümü</button>';
        letters.forEach(function(l) {
            html += '<button class="alpha-btn" data-letter="' + l + '">' + l + '</button>';
        });
        bar.innerHTML = html;

        bar.querySelectorAll('.alpha-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                bar.querySelectorAll('.alpha-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                pharmaSelectedLetter = btn.getAttribute('data-letter');
                renderPharmaList();
            });
        });
    }
}

function renderPharmaList() {
    const area = document.getElementById('content-area');
    if (!area || !window.PHARMA_DATA) return;

    const searchVal = (document.getElementById('pharmaSearchInput').value || '').toLowerCase().trim();
    const catVal = document.getElementById('pharmaCategoryFilter').value;
    const formVal = document.getElementById('pharmaFormFilter').value;

    const filtered = window.PHARMA_DATA.filter(function(item) {
        const matchLetter = pharmaSelectedLetter === 'ALL' || item.name.toUpperCase().startsWith(pharmaSelectedLetter);
        const matchCat = catVal === 'ALL' || item.category === catVal;
        const matchForm = formVal === 'ALL' || (item.forms && item.forms.toLowerCase().indexOf(formVal.toLowerCase()) !== -1);
        const matchSearch = !searchVal ||
            item.name.toLowerCase().indexOf(searchVal) !== -1 ||
            (item.brands && item.brands.toLowerCase().indexOf(searchVal) !== -1) ||
            (item.usage && item.usage.toLowerCase().indexOf(searchVal) !== -1);

        return matchLetter && matchCat && matchForm && matchSearch;
    }).sort(function(a, b) { return a.name.localeCompare(b.name, 'tr'); });

    document.getElementById('pharmaCountText').innerText = filtered.length + ' etken madde';
    area.innerHTML = '';

    if (filtered.length === 0) {
        area.innerHTML = '<div class="reader-box"><p>Arama kriterlerine uygun ilaç veya etken madde bulunamadı.</p></div>';
        return;
    }

    filtered.forEach(function(drug) {
        const card = document.createElement('div');
        card.style.cssText = 'background:#ffffff; border:1px solid #d1d5db; border-left:4px solid #2d5a27; border-radius:10px; padding:14px 16px; margin-bottom:12px; box-shadow:0 1px 3px rgba(0,0,0,0.04);';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px;';

        const titleWrap = document.createElement('div');
        const title = document.createElement('strong');
        title.style.cssText = 'font-size:16px; color:#111827; display:block;';
        title.innerText = drug.name;
        titleWrap.appendChild(title);

        if (drug.brands) {
            const brands = document.createElement('span');
            brands.style.cssText = 'font-size:12px; color:#4b5563; font-weight:600;';
            brands.innerText = 'Piyasa İsimleri: ' + drug.brands;
            titleWrap.appendChild(brands);
        }
        header.appendChild(titleWrap);

        const badges = document.createElement('div');
        badges.style.cssText = 'display:flex; gap:6px; flex-wrap:wrap;';

        const catBadge = document.createElement('span');
        catBadge.className = 'badge b-cat';
        catBadge.innerText = drug.category;
        badges.appendChild(catBadge);

        const formBadge = document.createElement('span');
        formBadge.className = 'badge b-time';
        formBadge.innerText = '📦 ' + drug.forms;
        badges.appendChild(formBadge);

        header.appendChild(badges);
        card.appendChild(header);

        const usageDiv = document.createElement('div');
        usageDiv.style.cssText = 'font-size:13px; color:#1f2937; margin-bottom:6px;';
        usageDiv.innerHTML = '<b>✅ Ne İçin Kullanılır:</b> ' + drug.usage;
        card.appendChild(usageDiv);

        const contraDiv = document.createElement('div');
        contraDiv.style.cssText = 'font-size:13px; color:#991b1b; background:#fef2f2; padding:6px 10px; border-radius:6px; margin-bottom:6px;';
        contraDiv.innerHTML = '<b>⛔ Kullanılmayacak Durumlar / Risk:</b> ' + drug.contra;
        card.appendChild(contraDiv);

        if (drug.fieldNote) {
            const noteDiv = document.createElement('div');
            noteDiv.style.cssText = 'font-size:12px; color:#374151; font-style:italic;';
            noteDiv.innerHTML = '<b>🏕️ Saha / SKT Notu:</b> ' + drug.fieldNote;
            card.appendChild(noteDiv);
        }

        area.appendChild(card);
    });
}

// Farmakoloji Sekmesi Buton Dinleyicisi
const pharmaModeBtn = document.getElementById('modePharmaBtn');
if (pharmaModeBtn) {
    pharmaModeBtn.addEventListener('click', function() {
        currentMode = 'pharma';
        document.getElementById('modePharmaBtn').classList.add('btn-active');
        document.getElementById('modeEncyclopediaBtn').classList.remove('btn-active');
        document.getElementById('modeAiBtn').classList.remove('btn-active');
        document.getElementById('directory-header').style.display = 'none';
        document.getElementById('pharma-header').style.display = 'block';
        initPharmaModule();
        renderPharmaList();
    });
}

['pharmaSearchInput', 'pharmaCategoryFilter', 'pharmaFormFilter'].forEach(function(elId) {
    const el = document.getElementById(elId);
    if (el) {
        el.addEventListener(elId === 'pharmaSearchInput' ? 'input' : 'change', renderPharmaList);
    }
});
// ==========================================
// MOBİL GERİ TUŞU, ÇIKIŞ KORUMASI VE SABİT YÜZEN GERİ DÖN BUTONU
// ==========================================
(function() {
    let exitWarningActive = false;
    let historyInitialized = false;

    // 1. Sağ Alt Köşede Her Zaman Sabit Duran Büyük "Geri Dön" Butonu Oluştur
    const floatingBackBtn = document.createElement('button');
    floatingBackBtn.id = 'avs-floating-back';
    floatingBackBtn.innerHTML = '⬅️ Geri Dön';
    floatingBackBtn.style.cssText = 'display:none; position:fixed; bottom:20px; right:20px; background:#2d5a27; color:#ffffff; border:2px solid #ffffff; padding:12px 18px; border-radius:30px; font-size:15px; font-weight:800; z-index:9998; box-shadow:0 4px 14px rgba(0,0,0,0.35); cursor:pointer;';
    document.body.appendChild(floatingBackBtn);

    function updateFloatingButton() {
        const mapWrap = document.getElementById('map-wrapper');
        const pharmaHeader = document.getElementById('pharma-header');
        const dirHeader = document.getElementById('directory-header');

        const isMapOpen = mapWrap && mapWrap.style.display === 'block';
        const isInPharma = pharmaHeader && pharmaHeader.style.display === 'block';
        const isInSubPage = dirHeader && dirHeader.style.display === 'none';

        if (isMapOpen || isInPharma || isInSubPage) {
            floatingBackBtn.style.display = 'block';
        } else {
            floatingBackBtn.style.display = 'none';
        }
    }

    // Sabit yüzen butona basıldığında bir önceki ekrana dön
    floatingBackBtn.addEventListener('click', function() {
        const mapWrap = document.getElementById('map-wrapper');
        if (mapWrap && mapWrap.style.display === 'block') {
            mapWrap.style.display = 'none';
            updateFloatingButton();
            return;
        }
        if (typeof resetToHome === 'function') {
            resetToHome();
        }
        updateFloatingButton();
    });

    // 2. Tarayıcı Güvenlik Kuralına Uygun İlk Dokunuşta Geçmiş Tamponu Kurma
    function armHistoryGuard() {
        if (!historyInitialized && window.history && window.history.pushState) {
            historyInitialized = true;
            window.history.pushState({ avsGuard: 1 }, '');
            window.history.pushState({ avsGuard: 2 }, '');
        }
    }

    document.addEventListener('touchstart', armHistoryGuard, { once: true });
    document.addEventListener('click', function(e) {
        armHistoryGuard();
        setTimeout(updateFloatingButton, 80);

        const target = e.target.closest('.article-card, #modePharmaBtn, #modeAiBtn, #toggleMapBtn, #searchBtn');
        if (target && window.history && window.history.pushState) {
            window.history.pushState({ avsView: Date.now() }, '');
        }
    });

    // 3. Telefonun Geri Tuşuna Basıldığında Yakala
    window.addEventListener('popstate', function() {
        const mapWrap = document.getElementById('map-wrapper');
        const pharmaHeader = document.getElementById('pharma-header');
        const dirHeader = document.getElementById('directory-header');

        // Harita açıksa kapat
        if (mapWrap && mapWrap.style.display === 'block') {
            mapWrap.style.display = 'none';
            updateFloatingButton();
            window.history.pushState({ avsGuard: 2 }, '');
            return;
        }

        // Makale, arama veya Farmakoloji ekranındaysa Ana Sayfaya dön
        const isInPharma = pharmaHeader && pharmaHeader.style.display === 'block';
        const isInSubPage = dirHeader && dirHeader.style.display === 'none';

        if (isInPharma || isInSubPage) {
            if (typeof resetToHome === 'function') {
                resetToHome();
            }
            updateFloatingButton();
            window.history.pushState({ avsGuard: 2 }, '');
            return;
        }

        // Ana Sayfadaysa kapanmayı engelle ve uyarı ver
        if (!exitWarningActive) {
            exitWarningActive = true;
            window.history.pushState({ avsGuard: 2 }, '');

            let toast = document.getElementById('avs-exit-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'avs-exit-toast';
                toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#111827; color:#ffffff; padding:12px 20px; border-radius:8px; font-size:14px; font-weight:700; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.35); text-align:center; border:2px solid #dc2626;';
                toast.innerText = '⚠️ Çıkmak için geri tuşuna tekrar basın';
                document.body.appendChild(toast);
            }
            toast.style.display = 'block';

            setTimeout(function() {
                exitWarningActive = false;
                if (toast) toast.style.display = 'none';
            }, 3000);
        }
    });

    // Sayfa kaydırıldığında veya değiştiğinde buton durumunu güncel tut
    setInterval(updateFloatingButton, 500);
})();

