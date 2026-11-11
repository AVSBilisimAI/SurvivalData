// ==========================================
// AVS HAYATTA KALMA VE SAHA TIBBİ MOTORU v2.0
// ==========================================
let allArticles = window.ARTICLES_DATA || [];
let currentMode = 'encyclopedia';
let selectedLetter = 'ALL';
let pharmaSelectedLetter = 'ALL';

let map = null;
let currentPin = null;
let rangeCircles = [];
let guideLines = [];
let lastClickedCoords = '';

function initApp() {
    initDirectoryFilters();
    renderDirectory();
}

function initDirectoryFilters() {
    const catSelect = document.getElementById('categoryFilter');
    if (catSelect) {
        const cats = Array.from(new Set(allArticles.map(function(a) { return a.category || 'Genel'; })))
            .sort(function(a, b) { return a.localeCompare(b, 'tr'); });
        catSelect.innerHTML = '<option value="ALL">Hepsi</option>';
        cats.forEach(function(c) {
            catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
    }

    const bar = document.getElementById('alpha-bar');
    if (bar) {
        const letters = Array.from(new Set(
            allArticles
                .filter(function(a) { return a && a.title && a.title.trim().length > 0; })
                .map(function(a) { return a.title.trim().charAt(0).toLocaleUpperCase('tr-TR'); })
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
        const matchLetter = selectedLetter === 'ALL' || (art.title || '').toLocaleUpperCase('tr-TR').startsWith(selectedLetter);
        const matchCat = catVal === 'ALL' || art.category === catVal;
        const matchRisk = riskVal === 'ALL' || art.riskLevel === riskVal;
        const matchPhase = phaseVal === 'ALL' || (art.phase && art.phase.indexOf(phaseVal) !== -1);
        return matchLetter && matchCat && matchRisk && matchPhase;
    });

    const countEl = document.getElementById('resultCountText');
    if (countEl) countEl.innerText = filtered.length + ' kart';

    area.innerHTML = '';

    if (filtered.length === 0) {
        area.innerHTML = '<div class="reader-box"><p>Seçilen filtrelere uygun rehber bulunamadı.</p></div>';
        return;
    }

    filtered.forEach(function(row) {
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

function openReader(id) {
    const art = allArticles.find(function(a) { return a.id === id; });
    if (!art) return;

    const dirHeader = document.getElementById('directory-header');
    if (dirHeader) dirHeader.style.display = 'none';
    const pharmaHeader = document.getElementById('pharma-header');
    if (pharmaHeader) pharmaHeader.style.display = 'none';

    const area = document.getElementById('content-area');
    if (!area) return;

    area.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.style.marginBottom = '16px';
    backBtn.innerText = '← Ansiklopediye Dön';
    backBtn.addEventListener('click', resetToHome);
    area.appendChild(backBtn);

    const box = document.createElement('div');
    box.className = 'reader-box';

    const h1 = document.createElement('h1');
    h1.style.marginTop = '0';
    h1.style.color = '#111827';
    h1.innerText = art.title;
    box.appendChild(h1);

    const badges = document.createElement('div');
    badges.className = 'card-badges';
    badges.style.marginBottom = '16px';
    badges.innerHTML = '<span class="badge b-risk">' + art.riskLevel + ' risk</span>' +
                       '<span class="badge b-cat">' + (art.category || 'Genel') + '</span>' +
                       '<span class="badge b-time">⏱️ ' + art.readTime + '</span>';
    box.appendChild(badges);

    const bodyDiv = document.createElement('div');
    bodyDiv.innerHTML = (typeof marked !== 'undefined') ? marked.parse(art.content || '') : (art.content || '');
    box.appendChild(bodyDiv);

    area.appendChild(box);
    window.scrollTo(0, 0);
}

function resetToHome() {
    currentMode = 'encyclopedia';
    const encBtn = document.getElementById('modeEncyclopediaBtn');
    const aiBtn = document.getElementById('modeAiBtn');
    const phBtn = document.getElementById('modePharmaBtn');
    if (encBtn) encBtn.classList.add('btn-active');
    if (aiBtn) aiBtn.classList.remove('btn-active');
    if (phBtn) phBtn.classList.remove('btn-active');

    const pharmaHeader = document.getElementById('pharma-header');
    if (pharmaHeader) pharmaHeader.style.display = 'none';
    const dirHeader = document.getElementById('directory-header');
    if (dirHeader) dirHeader.style.display = 'block';

    renderDirectory();
}
// ==========================================
// 2. BÖLÜM: DANIŞMAN (AI) VE BİRLEŞİK ARAMA MOTORU
// ==========================================
function executeSearch() {
    const inputEl = document.getElementById('searchInput');
    const rawQuery = inputEl ? inputEl.value.trim() : '';
    if (!rawQuery) {
        resetToHome();
        return;
    }

    const dirHeader = document.getElementById('directory-header');
    if (dirHeader) dirHeader.style.display = 'none';
    const pharmaHeader = document.getElementById('pharma-header');
    if (pharmaHeader) pharmaHeader.style.display = 'none';

    const qNorm = rawQuery.toLocaleLowerCase('tr-TR');
    const cleanWords = qNorm
        .replace(/[^\w\sğüşıöç]/g, '')
        .split(/\s+/)
        .filter(function(w) { return w.length > 2; });
    
    const searchTerms = cleanWords.length > 0 ? cleanWords : [qNorm];

    // Önce İlaçları Ara (74 Etken Madde & Piyasa İsimleri)
    let matchedDrugs = [];
    if (window.PHARMA_DATA && Array.isArray(window.PHARMA_DATA)) {
        matchedDrugs = window.PHARMA_DATA.filter(function(drug) {
            const hay = (
                (drug.name || '') + ' ' +
                (drug.brands || '') + ' ' +
                (drug.usage || '') + ' ' +
                (drug.contra || '') + ' ' +
                (drug.category || '')
            ).toLocaleLowerCase('tr-TR');

            return searchTerms.some(function(term) {
                const root = term.length > 4 ? term.slice(0, -1) : term;
                return hay.indexOf(root) !== -1;
            });
        }).slice(0, 6);
    }

    // Sonra Makaleleri Ara
    const scoredResults = allArticles.map(function(art) {
        let score = 0;
        const titleLower = (art.title || '').toLocaleLowerCase('tr-TR');
        const contentLower = (art.content || '').toLocaleLowerCase('tr-TR');

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

    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.style.marginBottom = '16px';
    backBtn.innerText = '← Ansiklopediye Dön';
    backBtn.addEventListener('click', resetToHome);
    area.appendChild(backBtn);

    if (results.length === 0 && matchedDrugs.length === 0) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'reader-box';
        emptyBox.innerText = '"' + rawQuery + '" sorgusuyla eşleşen bir kayıt veya ilaç bulunamadı.';
        area.appendChild(emptyBox);
        return;
    }

    // Danışman (AI) Özet Kutusu
    if (currentMode === 'ai') {
        const matchedLines = [];
        const warningLines = [];

        matchedDrugs.slice(0, 3).forEach(function(drug) {
            matchedLines.push('💊 [' + drug.name + ' / ' + (drug.brands || drug.forms) + '] ' + drug.usage);
            if (drug.contra) {
                warningLines.push('💊 [' + drug.name + '] ' + drug.contra);
            }
        });

        results.slice(0, 3).forEach(function(art) {
            const lines = (art.content || '').split('\n');
            lines.forEach(function(line) {
                const trimmed = line.trim();
                if (trimmed.startsWith('---') || trimmed.startsWith('baslik:') || trimmed.startsWith('etiketler:') || trimmed.startsWith('#')) return;
                
                const plain = trimmed.replace(/[*`_|\-]/g, ' ').replace(/\s+/g, ' ').trim();
                if (plain.length < 25 || plain.length > 240 || plain.indexOf('<') !== -1) return;
                
                const plainLower = plain.toLocaleLowerCase('tr-TR');
                const isMatch = searchTerms.some(function(term) {
                    const root = term.length > 4 ? term.slice(0, -1) : term;
                    return plainLower.indexOf(root) !== -1;
                });

                if (isMatch) {
                    const shortTitle = art.title.split(' ').slice(0, 2).join(' ');
                    const entryText = '[' + shortTitle + '] ' + plain;
                    if (plainLower.indexOf('uyarı') !== -1 || plainLower.indexOf('zehir') !== -1 || plainLower.indexOf('ölümcül') !== -1 || plainLower.indexOf('dikkat') !== -1) {
                        if (warningLines.length < 4 && warningLines.indexOf(entryText) === -1) warningLines.push(entryText);
                    } else {
                        if (matchedLines.length < 7 && matchedLines.indexOf(entryText) === -1) matchedLines.push(entryText);
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
            li.innerText = 'İlgili kılavuz ve ilaç kartları aşağıda listelenmiştir.';
            infoUl.appendChild(li);
        }
        infoDiv.appendChild(infoUl);
        aiBox.appendChild(infoDiv);
        area.appendChild(aiBox);
    }

    // Eşleşen İlaç Kartları
    matchedDrugs.forEach(function(drug) {
        const dCard = document.createElement('div');
        dCard.style.cssText = 'background:#f0fdf4; border:1px solid #16a34a; border-left:5px solid #15803d; border-radius:10px; padding:12px 16px; margin-bottom:12px;';
        dCard.innerHTML = '<div style="font-weight:800; color:#14532d; font-size:15px;">💊 İlaç Eşleşmesi: ' + drug.name + ' <span style="font-weight:500; font-size:12px; color:#374151;">(' + (drug.brands || drug.forms) + ')</span></div>' +
            '<div style="font-size:13px; color:#1f2937; margin-top:4px;"><b>✅ Kullanım:</b> ' + drug.usage + '</div>' +
            '<div style="font-size:12px; color:#991b1b; margin-top:4px;"><b>⛔ Dikkat / Risk:</b> ' + drug.contra + '</div>';
        area.appendChild(dCard);
    });

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
// ==========================================
// 3. BÖLÜM: SAHA FARMAKOLOJİ ANSİKLOPEDİSİ
// ==========================================
function initPharmaModule() {
    if (!window.PHARMA_DATA || !Array.isArray(window.PHARMA_DATA)) return;

    const catSelect = document.getElementById('pharmaCategoryFilter');
    if (catSelect) {
        const cats = Array.from(new Set(window.PHARMA_DATA.map(function(p) { return p.category; })))
            .sort(function(a, b) { return a.localeCompare(b, 'tr'); });
        catSelect.innerHTML = '<option value="ALL">Tüm Kategoriler</option>';
        cats.forEach(function(c) {
            catSelect.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
    }

    const bar = document.getElementById('pharma-alpha-bar');
    if (bar) {
        const letters = Array.from(new Set(
            window.PHARMA_DATA
                .filter(function(p) { return p && p.name && p.name.trim().length > 0; })
                .map(function(p) { return p.name.trim().charAt(0).toLocaleUpperCase('tr-TR'); })
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

    const sEl = document.getElementById('pharmaSearchInput');
    const cEl = document.getElementById('pharmaCategoryFilter');
    const fEl = document.getElementById('pharmaFormFilter');

    const searchVal = (sEl ? sEl.value : '').toLocaleLowerCase('tr-TR').trim();
    const catVal = cEl ? cEl.value : 'ALL';
    const formVal = fEl ? fEl.value : 'ALL';

    const filtered = window.PHARMA_DATA.filter(function(item) {
        const matchLetter = pharmaSelectedLetter === 'ALL' || (item.name || '').toLocaleUpperCase('tr-TR').startsWith(pharmaSelectedLetter);
        const matchCat = catVal === 'ALL' || item.category === catVal;
        const matchForm = formVal === 'ALL' || (item.forms && item.forms.toLocaleLowerCase('tr-TR').indexOf(formVal.toLocaleLowerCase('tr-TR')) !== -1);
        const matchSearch = !searchVal ||
            (item.name || '').toLocaleLowerCase('tr-TR').indexOf(searchVal) !== -1 ||
            (item.brands || '').toLocaleLowerCase('tr-TR').indexOf(searchVal) !== -1 ||
            (item.usage || '').toLocaleLowerCase('tr-TR').indexOf(searchVal) !== -1;

        return matchLetter && matchCat && matchForm && matchSearch;
    }).sort(function(a, b) { return a.name.localeCompare(b.name, 'tr'); });

    const countEl = document.getElementById('pharmaCountText');
    if (countEl) countEl.innerText = filtered.length + ' etken madde';

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
// ==========================================
// 4. BÖLÜM: ÇEVRİMDIŞI HARİTA VE PUSULA ANALİZİ
// ==========================================
function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

function initMapEngine(pmtilesSource) {
    if (map) {
        map.remove();
        map = null;
    }

    map = L.map('map-area').setView([39.0, 35.0], 6);
    const protoLib = window.protomapsL || window.protomapsLeaflet;

    if (pmtilesSource && protoLib) {
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
            { dataLayer: "buildings", symbolizer: new protoLib.PolygonSymbolizer({ fill: "#e2e8f0", stroke: "#cbd5e1", width: 0.5 }) },
            { dataLayer: "boundaries", symbolizer: new protoLib.LineSymbolizer({ color: "#94a3b8", width: 1 }) }
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

        const setupLayer = function(maxZoomVal) {
            if (navigator.onLine) {
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    opacity: 0.85
                }).addTo(map);
            }

            const layer = protoLib.leafletLayer({
                url: pmObj,
                paintRules: paintRules,
                labelRules: labelRules,
                maxDataZoom: maxZoomVal || 14
            });
            layer.addTo(map);

            L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);
            const statusEl = document.getElementById('mapStatusText');
            if (statusEl) statusEl.innerHTML = '<span style="color:#166534;">✅ Çevrimdışı Türkiye Haritası Aktif</span>';
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
    }

    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        lastClickedCoords = lat + ', ' + lng;

        if (currentPin) map.removeLayer(currentPin);
        rangeCircles.forEach(function(c) { map.removeLayer(c); });
        guideLines.forEach(function(l) { map.removeLayer(l); });
        rangeCircles = [];
        guideLines = [];

        currentPin = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#dc2626',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 1
        }).addTo(map).bindPopup('<b>Seçilen Nokta</b><br>' + lastClickedCoords).openPopup();

        rangeCircles.push(
            L.circle([lat, lng], { radius: 1000, color: '#16a34a', weight: 2, fillOpacity: 0.08 }).addTo(map),
            L.circle([lat, lng], { radius: 5000, color: '#ca8a04', weight: 1.5, dashArray: '5,5', fillOpacity: 0.04 }).addTo(map),
            L.circle([lat, lng], { radius: 15000, color: '#dc2626', weight: 1.5, dashArray: '8,8', fillOpacity: 0.02 }).addTo(map)
        );

        const cPanel = document.getElementById('coord-panel');
        if (cPanel) cPanel.style.display = 'block';
        const cText = document.getElementById('coordText');
        if (cText) cText.innerText = 'Enlem: ' + lat + ' | Boylam: ' + lng;

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
                const walkHours = (item.dist / 3.5).toFixed(1);

                listHtml += '<div style="font-size:12px; color:#1f2937; margin-bottom:5px; padding:5px 8px; background:#f8fafc; border-left:3px solid ' + lineColor + '; border-radius:4px;">' +
                    icon + ' <b>' + item.dir + ' yönünde ' + item.dist.toFixed(1) + ' km</b> — <b>' + item.poi.name + '</b> ' +
                    '<span style="color:#6b7280;">(' + item.poi.note + ' • Yürüyüş: ~' + walkHours + ' saat)</span>' +
                '</div>';

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

// ==========================================
// 5. BÖLÜM: TÜM BUTON VE OLAY DİNLEYİCİLERİ
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initApp();

    const encBtn = document.getElementById('modeEncyclopediaBtn');
    if (encBtn) encBtn.addEventListener('click', resetToHome);

    const aiBtn = document.getElementById('modeAiBtn');
    if (aiBtn) {
        aiBtn.addEventListener('click', function() {
            currentMode = 'ai';
            aiBtn.classList.add('btn-active');
            if (encBtn) encBtn.classList.remove('btn-active');
            const phBtn = document.getElementById('modePharmaBtn');
            if (phBtn) phBtn.classList.remove('btn-active');

            const phHeader = document.getElementById('pharma-header');
if (phHeader) phHeader.style.display = 'none';
const dirHeader = document.getElementById('directory-header');
if (dirHeader) dirHeader.style.display = 'block';
});
}
const pharmaBtn = document.getElementById('modePharmaBtn');
if (pharmaBtn) {
pharmaBtn.addEventListener('click', function() {
currentMode = 'pharma';
pharmaBtn.classList.add('btn-active');
if (encBtn) encBtn.classList.remove('btn-active');
if (aiBtn) aiBtn.classList.remove('btn-active');
const dirHeader = document.getElementById('directory-header');
if (dirHeader) dirHeader.style.display = 'none';
const phHeader = document.getElementById('pharma-header');
if (phHeader) phHeader.style.display = 'block';
initPharmaModule();
renderPharmaList();
});
}
const mapBtn = document.getElementById('toggleMapBtn');
if (mapBtn) {
mapBtn.addEventListener('click', function() {
const w = document.getElementById('map-wrapper');
if (!w) return;
if (w.style.display === 'none' || !w.style.display) {
w.style.display = 'block';
if (!map) {
initMapEngine('./maps/turkey.pmtiles');
} else {
map.invalidateSize();
}
} else {
w.style.display = 'none';
}
});
}
const fileInp = document.getElementById('pmtilesFileInput');
if (fileInp) {
fileInp.addEventListener('change', function(e) {
const file = e.target.files[0];
if (file && typeof pmtiles !== 'undefined') {
initMapEngine(new pmtiles.PMTiles(new pmtiles.FileSource(file)));
}
});
}
const copyBtn = document.getElementById('copyCoordBtn');
if (copyBtn) {
copyBtn.addEventListener('click', function() {
if (lastClickedCoords && navigator.clipboard) {
navigator.clipboard.writeText(lastClickedCoords);
copyBtn.innerText = '✅ Kopyalandı';
setTimeout(function() { copyBtn.innerText = '📋 Koordinatı Kopyala'; }, 1500);
}
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
['categoryFilter', 'riskFilter', 'phaseFilter'].forEach(function(id) {
const el = document.getElementById(id);
if (el) el.addEventListener('change', renderDirectory);
});
['pharmaSearchInput', 'pharmaCategoryFilter', 'pharmaFormFilter'].forEach(function(id) {
const el = document.getElementById(id);
if (el) {
el.addEventListener(id === 'pharmaSearchInput' ? 'input' : 'change', renderPharmaList);
}
});
const updateBtn = document.getElementById('forceUpdateBtn');
if (updateBtn) {
updateBtn.addEventListener('click', function() {
if (!navigator.onLine) {
alert('⚠️ İnternet bağlantınız yok! Mevcut çevrimdışı verileriniz korunuyor.');
return;
}
updateBtn.innerText = '⏳ Güncelleniyor...';
updateBtn.disabled = true;
if ('caches' in window) {
caches.keys().then(function(names) {
return Promise.all(names.map(function(name) { return caches.delete(name); }));
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