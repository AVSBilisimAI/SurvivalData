let allArticles = window.ARTICLES_EN || window.ARTICLES_DATA || new Array();
let allPharma = window.PHARMA_EN || window.PHARMA_DATA || new Array();
let currentMode = 'encyclopedia';
let selectedLetter = 'ALL';
let pharmaSelectedLetter = 'ALL';
let map = null;
let currentPin = null;
let rangeCircles = new Array();
let guideLines = new Array();
let lastClickedCoords = '';

function initApp() {
    initDirectoryFilters();
    renderDirectory();
}

function initDirectoryFilters() {
    const catSelect = document.getElementById('categoryFilter');
    if (catSelect) {
        const cats = Array.from(new Set(allArticles.map(function(a) { return a.category || 'General'; }))).sort();
        catSelect.innerHTML = '<option value="ALL">All Categories</option>';
        cats.forEach(function(c) {
            catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
    }

    const bar = document.getElementById('alpha-bar');
    if (bar) {
        const letters = Array.from(new Set(
            allArticles.filter(function(a) { return a && a.title; }).map(function(a) { return a.title.trim().charAt(0).toUpperCase(); })
        )).sort();

        let html = '<button class="alpha-btn active" data-letter="ALL">All</button>';
        letters.forEach(function(l) {
            html += '<button class="alpha-btn" data-letter="' + l + '">' + l + '</button>';
        });
        bar.innerHTML = html;

        bar.querySelectorAll('.alpha-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                bar.querySelectorAll('.alpha-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                selectedLetter = btn.getAttribute('data-letter');
                renderDirectory();
            });
        });
    }
}

function renderDirectory() {
    const area = document.getElementById('content-area');
    if (!area) return;

    const catEl = document.getElementById('categoryFilter');
    const riskEl = document.getElementById('riskFilter');
    const phaseEl = document.getElementById('phaseFilter');

    const catVal = catEl ? catEl.value : 'ALL';
    const riskVal = riskEl ? riskEl.value : 'ALL';
    const phaseVal = phaseEl ? phaseEl.value : 'ALL';

    const filtered = allArticles.filter(function(art) {
        const matchLetter = selectedLetter === 'ALL' || (art.title || '').toUpperCase().startsWith(selectedLetter);
        const matchCat = catVal === 'ALL' || art.category === catVal;
        const matchRisk = riskVal === 'ALL' || (art.riskLevel && art.riskLevel.toLowerCase().indexOf(riskVal.toLowerCase()) !== -1);
        const matchPhase = phaseVal === 'ALL' || (art.phase && art.phase.indexOf(phaseVal) !== -1);
        return matchLetter && matchCat && matchRisk && matchPhase;
    });

    const countEl = document.getElementById('resultCountText');
    if (countEl) countEl.innerText = filtered.length + ' cards';
    area.innerHTML = '';

    if (filtered.length === 0) {
        area.innerHTML = '<div class="reader-box"><p>No guides found matching your filters.</p></div>';
        return;
    }

    filtered.forEach(function(row) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.addEventListener('click', function() { openReader(row.id); });
        card.innerHTML = '<div class="card-title">' + row.title + '</div>' +
            '<div class="card-badges">' +
                '<span class="badge b-risk">' + (row.riskLevel || 'Medium') + ' risk</span>' +
                '<span class="badge b-cat">' + (row.category || 'General') + '</span>' +
                '<span class="badge b-time">⏱️ ' + (row.readTime || '5 min') + '</span>' +
            '</div>';
        area.appendChild(card);
    });
}
function simpleMarkdownToHtml(md) {
    if (!md) return '';
    // Eğer marked kütüphanesi yüklüyse onu kullan
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
        return marked.parse(md);
    }
    // Yüklü değilse dahili dönüştürücü ile temiz HTML'e çevir
    let html = md
        .replace(/^###\s+(.+)$/gm, '<h3 style="color:#1f2937; margin-top:16px;">$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2 style="color:#2d5a27; border-bottom:1px solid #e5e7eb; padding-bottom:4px; margin-top:20px;">$1</h2>')
        .replace(/^#\s+(.+)$/gm, '') // Ana başlık zaten üstte yazıyor
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^\s*[-*]\s+(.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
        .replace(/^\s*\d+\.\s+(.+)$/gm, '<li style="margin-bottom:6px;">$1</li>');

    html = html.split('\n\n').map(function(block) {
        block = block.trim();
        if (!block) return '';
        if (block.startsWith('<h') || block.startsWith('<li')) return block;
        return '<p style="margin-bottom:12px;">' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    return html;
}

function openReader(id) {
    const art = allArticles.find(function(a) { return a.id === id; });
    if (!art) return;
    const dirH = document.getElementById('directory-header');
    const phH = document.getElementById('pharma-header');
    if (dirH) dirH.style.display = 'none';
    if (phH) phH.style.display = 'none';

    const area = document.getElementById('content-area');
    const parsedHtml = simpleMarkdownToHtml(art.content || '');
    area.innerHTML = '<button class="btn" style="margin-bottom:16px;" onclick="resetToHome()">← Back to Encyclopedia</button>' +
        '<div class="reader-box">' +
            '<h1 style="margin-top:0; color:#111827;">' + art.title + '</h1>' +
            '<div class="card-badges" style="margin-bottom:16px;">' +
                '<span class="badge b-risk">' + (art.riskLevel || 'Medium') + ' risk</span>' +
                '<span class="badge b-cat">' + (art.category || 'General') + '</span>' +
                '<span class="badge b-time">⏱️ ' + (art.readTime || '5 min') + '</span>' +
            '</div>' +
            '<div>' + parsedHtml + '</div>' +
        '</div>';
    window.scrollTo(0, 0);
}


function resetToHome() {
    currentMode = 'encyclopedia';
    const bEnc = document.getElementById('modeEncyclopediaBtn');
    const bAi = document.getElementById('modeAiBtn');
    const bPh = document.getElementById('modePharmaBtn');
    if (bEnc) bEnc.classList.add('btn-active');
    if (bAi) bAi.classList.remove('btn-active');
    if (bPh) bPh.classList.remove('btn-active');

    const phH = document.getElementById('pharma-header');
    const dirH = document.getElementById('directory-header');
    if (phH) phH.style.display = 'none';
    if (dirH) dirH.style.display = 'block';
    renderDirectory();
}

function executeSearch() {
    const sInp = document.getElementById('searchInput');
    const rawQuery = (sInp ? sInp.value : '').trim();
    if (!rawQuery) { resetToHome(); return; }

    const dirH = document.getElementById('directory-header');
    const phH = document.getElementById('pharma-header');
    if (dirH) dirH.style.display = 'none';
    if (phH) phH.style.display = 'none';

    const qLower = rawQuery.toLowerCase();
    const terms = qLower.split(/\s+/).filter(function(w) { return w.length > 2; });
    const searchTerms = terms.length > 0 ? terms : new Array(qLower);

    let matchedDrugs = new Array();
    if (Array.isArray(allPharma)) {
        matchedDrugs = allPharma.filter(function(d) {
            const hay = ((d.name || '') + ' ' + (d.brands || '') + ' ' + (d.usage || '') + ' ' + (d.category || '')).toLowerCase();
            return searchTerms.some(function(t) { return hay.indexOf(t) !== -1; });
        }).slice(0, 5);
    }

    const results = allArticles.map(function(art) {
        let score = 0;
        const t = (art.title || '').toLowerCase();
        const c = (art.content || '').toLowerCase();
        searchTerms.forEach(function(term) {
            if (t.includes(term)) score += 20;
            if (c.includes(term)) score += 3;
        });
        return { article: art, score: score };
    }).filter(function(x) { return x.score > 0; }).sort(function(a, b) { return b.score - a.score; }).map(function(x) { return x.article; });

    const area = document.getElementById('content-area');
    area.innerHTML = '<button class="btn" style="margin-bottom:16px;" onclick="resetToHome()">← Back to Encyclopedia</button>';

    if (results.length === 0 && matchedDrugs.length === 0) {
        area.innerHTML += '<div class="reader-box">No guides or medications found for "' + rawQuery + '".</div>';
        return;
    }

    if (currentMode === 'ai') {
        const matchedLines = new Array();
        matchedDrugs.slice(0, 3).forEach(function(drug) {
            matchedLines.push('💊 [' + drug.name + ' / ' + (drug.brands || drug.forms) + '] ' + drug.usage);
        });
        results.slice(0, 3).forEach(function(art) {
            (art.content || '').split('\n').forEach(function(line) {
                const clean = line.replace(/[*#`_\-|]/g, ' ').replace(/\s+/g, ' ').trim();
                if (clean.length > 25 && clean.length < 240 && searchTerms.some(function(t) { return clean.toLowerCase().includes(t); })) {
                    if (matchedLines.length < 6) matchedLines.push('[' + art.title.split(' ').slice(0, 2).join(' ') + '] ' + clean);
                }
            });
        });

        const aiBox = document.createElement('div');
        aiBox.style.cssText = 'background:#ffffff; border:2px solid #2d5a27; padding:18px; border-radius:12px; margin-bottom:20px;';
        aiBox.innerHTML = '<h3 style="color:#2d5a27; margin:0 0 12px 0;">🧠 Advisor (AI) Triage Response: "' + rawQuery + '"</h3>' +
            '<ul style="margin:0; padding-left:18px; color:#1f2937;">' +
                (matchedLines.length > 0 ? matchedLines.map(function(m) { return '<li style="margin-bottom:6px;">' + m + '</li>'; }).join('') : '<li>Relevant field manuals and drugs are listed below.</li>') +
            '</ul>';
        area.appendChild(aiBox);
    }

    matchedDrugs.forEach(function(drug) {
        const dCard = document.createElement('div');
        dCard.style.cssText = 'background:#f0fdf4; border:1px solid #16a34a; border-left:5px solid #15803d; border-radius:10px; padding:12px 16px; margin-bottom:12px;';
        dCard.innerHTML = '<div style="font-weight:800; color:#14532d; font-size:15px;">💊 Medication Match: ' + drug.name + ' (' + (drug.brands || drug.forms) + ')</div>' +
            '<div style="font-size:13px; color:#1f2937; margin-top:4px;"><b>✅ Usage:</b> ' + drug.usage + '</div>' +
            '<div style="font-size:12px; color:#991b1b; margin-top:4px;"><b>⛔ Warning:</b> ' + drug.contra + '</div>';
        area.appendChild(dCard);
    });

    results.forEach(function(row) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.addEventListener('click', function() { openReader(row.id); });
        card.innerHTML = '<div class="card-title">' + row.title + '</div>' +
            '<div class="card-badges">' +
                '<span class="badge b-risk">' + (row.riskLevel || 'Medium') + ' risk</span>' +
                '<span class="badge b-cat">' + (row.category || 'General') + '</span>' +
                '<span class="badge b-time">⏱️ ' + (row.readTime || '5 min') + '</span>' +
            '</div>';
        area.appendChild(card);
    });
}
function initPharmaModule() {
    if (!Array.isArray(allPharma)) return;
    const catSelect = document.getElementById('pharmaCategoryFilter');
    if (catSelect) {
        const cats = Array.from(new Set(allPharma.map(function(p) { return p.category; }))).sort();
        catSelect.innerHTML = '<option value="ALL">All Categories</option>';
        cats.forEach(function(c) { catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>'; });
    }

    const bar = document.getElementById('pharma-alpha-bar');
    if (bar) {
        const letters = Array.from(new Set(allPharma.filter(function(p) { return p && p.name; }).map(function(p) { return p.name.charAt(0).toUpperCase(); }))).sort();
        let html = '<button class="alpha-btn active" data-letter="ALL">All</button>';
        letters.forEach(function(l) { html += '<button class="alpha-btn" data-letter="' + l + '">' + l + '</button>'; });
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
    if (!area || !Array.isArray(allPharma)) return;

    const searchEl = document.getElementById('pharmaSearchInput');
    const catEl = document.getElementById('pharmaCategoryFilter');
    const formEl = document.getElementById('pharmaFormFilter');

    const searchVal = (searchEl ? searchEl.value : '').toLowerCase().trim();
    const catVal = catEl ? catEl.value : 'ALL';
    const formVal = formEl ? formEl.value : 'ALL';

    const filtered = allPharma.filter(function(item) {
        const matchLetter = pharmaSelectedLetter === 'ALL' || item.name.toUpperCase().startsWith(pharmaSelectedLetter);
        const matchCat = catVal === 'ALL' || item.category === catVal;
        const matchForm = formVal === 'ALL' || (item.forms && item.forms.toLowerCase().indexOf(formVal.toLowerCase()) !== -1);
        const matchSearch = !searchVal || ((item.name || '') + ' ' + (item.brands || '') + ' ' + (item.usage || '')).toLowerCase().indexOf(searchVal) !== -1;
        return matchLetter && matchCat && matchForm && matchSearch;
    }).sort(function(a, b) { return a.name.localeCompare(b.name); });

    const countEl = document.getElementById('pharmaCountText');
    if (countEl) countEl.innerText = filtered.length + ' active ingredients';
    area.innerHTML = '';

    filtered.forEach(function(drug) {
        const card = document.createElement('div');
        card.style.cssText = 'background:#ffffff; border:1px solid #d1d5db; border-left:4px solid #2d5a27; border-radius:10px; padding:14px 16px; margin-bottom:12px;';
        card.innerHTML = '<div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:8px;">' +
                '<div>' +
                    '<strong style="font-size:16px; color:#111827; display:block;">' + drug.name + '</strong>' +
                    '<span style="font-size:12px; color:#4b5563; font-weight:600;">Brand Examples: ' + (drug.brands || '-') + '</span>' +
                '</div>' +
                '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                    '<span class="badge b-cat">' + drug.category + '</span>' +
                    '<span class="badge b-time">📦 ' + drug.forms + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="font-size:13px; color:#1f2937; margin-bottom:6px;"><b>✅ Indications / Usage:</b> ' + drug.usage + '</div>' +
            '<div style="font-size:13px; color:#991b1b; background:#fef2f2; padding:6px 10px; border-radius:6px; margin-bottom:6px;"><b>⛔ Contraindications / Risk:</b> ' + drug.contra + '</div>' +
            '<div style="font-size:12px; color:#374151; font-style:italic;"><b>🏕️ Field / Expiry Note:</b> ' + (drug.fieldNote || '') + '</div>';
        area.appendChild(card);
    });
}
function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcDirectionEn(lat1, lon1, lat2, lon2) {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const dirs = new Array("North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest");
    return dirs.at(Math.round(brng / 45) % 8);
}

function initMapEngine(pmtilesSource) {
    if (map) {
        map.remove();
        map = null;
    }

    map = L.map('map-area').setView(new Array(39.0, 35.0), 6);
    const protoLib = window.protomapsL || window.protomapsLeaflet;

    if (pmtilesSource && protoLib) {
        const paintRules = new Array(
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
            { dataLayer: "buildings", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#e2e8f0", stroke: "#cbd5e1", width: 0.5 }) },
            { dataLayer: "boundaries", symbolizer: new protoLib.LineSymbolizer({ color: "#94a3b8", width: 1 }) }
        );

        const labelRules = new Array(
            {
                dataLayer: "place_labels",
                symbolizer: new protoLib.CenteredTextSymbolizer({
                    labelProps: new Array("name:en", "name:tr", "name"),
                    fill: "#1e293b",
                    stroke: "#ffffff",
                    width: 2.5,
                    font: "700 13px sans-serif"
                })
            },
            {
                dataLayer: "street_labels",
                symbolizer: new protoLib.LineLabelSymbolizer({
                    labelProps: new Array("name:en", "name:tr", "name"),
                    fill: "#475569",
                    stroke: "#ffffff",
                    width: 2,
                    font: "500 11px sans-serif"
                })
            },
            {
                dataLayer: "water_lines_labels",
                symbolizer: new protoLib.LineLabelSymbolizer({
                    labelProps: new Array("name:en", "name:tr", "name"),
                    fill: "#0284c7",
                    stroke: "#ffffff",
                    width: 2,
                    font: "600 11px sans-serif"
                })
            }
        );

        const pmObj = (typeof pmtilesSource === 'string') ? new pmtiles.PMTiles(pmtilesSource) : pmtilesSource;

        const setupLayer = function(maxZoomVal) {
            if (navigator.onLine) {
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    opacity: 0.85
                }).addTo(map);
            }

            protoLib.leafletLayer({
                url: pmObj,
                paintRules: paintRules,
                labelRules: labelRules,
                maxDataZoom: maxZoomVal || 14
            }).addTo(map);

            L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);
            const st = document.getElementById('mapStatusText');
            if (st) st.innerHTML = '<span style="color:#166534;">✅ Offline Map Active</span>';
        };

        if (pmObj && typeof pmObj.getHeader === 'function') {
            pmObj.getHeader().then(function(h) {
                setupLayer(h ? h.maxZoom : 14);
                if (h && h.centerLat && h.centerLon) {
                    map.setView(new Array(h.centerLat, h.centerLon), Math.max(h.minZoom || 8, h.centerZoom || 10));
                }
            }).catch(function() {
                setupLayer(14);
            });
        } else {
            setupLayer(14);
        }
    } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    }

    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        lastClickedCoords = lat + ', ' + lng;

        if (currentPin) map.removeLayer(currentPin);
        rangeCircles.forEach(function(c) { map.removeLayer(c); });
        guideLines.forEach(function(l) { map.removeLayer(l); });
        rangeCircles = new Array();
        guideLines = new Array();

        currentPin = L.circleMarker(new Array(lat, lng), { radius: 8, fillColor: '#dc2626', color: '#ffffff', weight: 2, fillOpacity: 1 })
            .addTo(map).bindPopup('<b>Selected Point</b><br>' + lastClickedCoords).openPopup();

        rangeCircles.push(
            L.circle(new Array(lat, lng), { radius: 1000, color: '#16a34a', weight: 2, fillOpacity: 0.08 }).addTo(map),
            L.circle(new Array(lat, lng), { radius: 5000, color: '#ca8a04', weight: 1.5, dashArray: '5,5', fillOpacity: 0.04 }).addTo(map),
            L.circle(new Array(lat, lng), { radius: 15000, color: '#dc2626', weight: 1.5, dashArray: '8,8', fillOpacity: 0.02 }).addTo(map)
        );

        const cp = document.getElementById('coord-panel');
        const ct = document.getElementById('coordText');
        if (cp) cp.style.display = 'block';
        if (ct) ct.innerText = 'Lat: ' + lat + ' | Lng: ' + lng;

        const nearbyBox = document.getElementById('nearby-resources');
        if (nearbyBox && window.SURVIVAL_POIS) {
            const analyzed = window.SURVIVAL_POIS.map(function(poi) {
                return { poi: poi, dist: calcDistanceKm(Number(lat), Number(lng), poi.lat, poi.lng), dir: calcDirectionEn(Number(lat), Number(lng), poi.lat, poi.lng) };
            }).sort(function(a, b) { return a.dist - b.dist; });

            const topTargets = analyzed.filter(function(x) { return x.poi.type === 'su'; }).slice(0, 2)
                .concat(analyzed.filter(function(x) { return x.poi.type === 'orman'; }).slice(0, 2))
                .sort(function(a, b) { return a.dist - b.dist; });

            let listHtml = '<div style="font-weight:700; color:#111827; font-size:13px; margin-bottom:6px;">🧭 Nearest Water & Forest Resources:</div>';
            topTargets.forEach(function(item) {
                const icon = item.poi.type === 'su' ? '💧' : '🌲';
                const color = item.poi.type === 'su' ? '#0284c7' : '#16a34a';
                const walkHours = (item.dist / 3.5).toFixed(1);
                listHtml += '<div style="font-size:12px; color:#1f2937; margin-bottom:5px; padding:5px 8px; background:#f8fafc; border-left:3px solid ' + color + '; border-radius:4px;">' +
                    icon + ' <b>' + item.dir + ' ' + item.dist.toFixed(1) + ' km</b> — <b>' + item.poi.name + '</b> <span style="color:#6b7280;">(~' + walkHours + ' hrs)</span></div>';
                const line = L.polyline(new Array(new Array(lat, lng), new Array(item.poi.lat, item.poi.lng)), { color: color, weight: 2, dashArray: '6,6', opacity: 0.75 }).addTo(map);
                guideLines.push(line);
            });
            nearbyBox.innerHTML = listHtml;
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    initApp();

    const floatingBackBtn = document.createElement('button');
    floatingBackBtn.innerHTML = '⬅️ Back';
    floatingBackBtn.style.cssText = 'display:none; position:fixed; bottom:20px; right:20px; background:#2d5a27; color:#ffffff; border:2px solid #ffffff; padding:12px 18px; border-radius:30px; font-size:15px; font-weight:800; z-index:9998; box-shadow:0 4px 14px rgba(0,0,0,0.35); cursor:pointer;';
    document.body.appendChild(floatingBackBtn);

    setInterval(function() {
        const mapWrap = document.getElementById('map-wrapper');
        const pharmaHeader = document.getElementById('pharma-header');
        const dirHeader = document.getElementById('directory-header');
        const isOpen = (mapWrap && mapWrap.style.display === 'block') || (pharmaHeader && pharmaHeader.style.display === 'block') || (dirHeader && dirHeader.style.display === 'none');
        floatingBackBtn.style.display = isOpen ? 'block' : 'none';
    }, 400);

    floatingBackBtn.addEventListener('click', function() {
        const mapWrap = document.getElementById('map-wrapper');
        if (mapWrap && mapWrap.style.display === 'block') { mapWrap.style.display = 'none'; return; }
        resetToHome();
    });

    const bEnc = document.getElementById('modeEncyclopediaBtn');
    const bAi = document.getElementById('modeAiBtn');
    const bPh = document.getElementById('modePharmaBtn');
    const bMap = document.getElementById('toggleMapBtn');
    const sBtn = document.getElementById('searchBtn');
    const sInp = document.getElementById('searchInput');
    const uBtn = document.getElementById('forceUpdateBtn');

    if (bEnc) bEnc.addEventListener('click', resetToHome);
    if (bAi) bAi.addEventListener('click', function() {
        currentMode = 'ai';
        bAi.classList.add('btn-active');
        if (bEnc) bEnc.classList.remove('btn-active');
        if (bPh) bPh.classList.remove('btn-active');
        document.getElementById('pharma-header').style.display = 'none';
        document.getElementById('directory-header').style.display = 'block';
    });
    if (bPh) bPh.addEventListener('click', function() {
        currentMode = 'pharma';
        bPh.classList.add('btn-active');
        if (bEnc) bEnc.classList.remove('btn-active');
        if (bAi) bAi.classList.remove('btn-active');
        document.getElementById('directory-header').style.display = 'none';
        document.getElementById('pharma-header').style.display = 'block';
        initPharmaModule();
        renderPharmaList();
    });
    if (bMap) bMap.addEventListener('click', function() {
        const w = document.getElementById('map-wrapper');
        if (!w) return;
        if (w.style.display === 'none' || !w.style.display) {
            w.style.display = 'block';
            if (!map) initMapEngine('../maps/turkey.pmtiles'); else map.invalidateSize();
        } else { w.style.display = 'none'; }
    });
        const fInp = document.getElementById('pmtilesFileInput');
    if (fInp) {
        fInp.addEventListener('change', function(e) {
            const file = e.target.files.item(0);
            if (file && typeof pmtiles !== 'undefined') {
                initMapEngine(new pmtiles.PMTiles(new pmtiles.FileSource(file)));
            }
        });
    }

    if (sBtn) sBtn.addEventListener('click', executeSearch);
    if (sInp) sInp.addEventListener('keypress', function(e) { if (e.key === 'Enter') executeSearch(); });
    new Array('categoryFilter', 'riskFilter', 'phaseFilter').forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', renderDirectory);
    });
    new Array('pharmaSearchInput', 'pharmaCategoryFilter', 'pharmaFormFilter').forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(id === 'pharmaSearchInput' ? 'input' : 'change', renderPharmaList);
    });
        if (uBtn) {
        uBtn.addEventListener('click', function() {
            if (!navigator.onLine) {
                alert('⚠️ Offline! Your cached data is safe.');
                return;
            }
            uBtn.innerText = '⏳ Updating...';
            uBtn.disabled = true;

            if ('caches' in window) {
                caches.keys().then(function(names) {
                    return Promise.all(names.map(function(n) { return caches.delete(n); }));
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

});
