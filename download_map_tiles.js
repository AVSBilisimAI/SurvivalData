const fs = require('fs');
const https = require('https');
const path = require('path');

const minZoom = 5;
const maxZoom = 15; 
const minLat = 35.5;
const maxLat = 42.5;
const minLon = 25.5;
const maxLon = 45.0;

const tilesDir = './maps/tiles';

if (!fs.existsSync(tilesDir)) {
    fs.mkdirSync(tilesDir, { recursive: true });
}

function lon2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function downloadTile(z, x, y) {
    // Doğada hayatta kalmak için çok daha uygun olan Topografik harita sunucusu
    const url = `https://tile.opentopomap.org/${z}/${x}/${y}.png`;
    const dir = path.join(tilesDir, `${z}/${x}`);
    const dest = path.join(dir, `${y}.png`);

    if (fs.existsSync(dest)) {
        // Eğer dosya çok küçükse (hata resmiyse) silip tekrar dener
        const stats = fs.statSync(dest);
        if (stats.size > 2000) return;
        fs.unlinkSync(dest);
    }

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Sistemleri kandırmak için gerçek bir Windows tarayıcısı gibi davranıyoruz
    const options = {
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://opentopomap.org/'
        }
    };

    return new Promise((resolve) => {
        https.get(url, options, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                response.pipe(file);
                file.on('finish', () => {
                    console.log(`[Topografik] İndirildi: ${z}/${x}/${y}.png`);
                    resolve();
                });
            } else {
                console.log(`Hata ${response.statusCode} - Pas geçildi: ${z}/${x}/${y}.png`);
                resolve();
            }
        }).on('error', (err) => {
            console.error(`Bağlantı Hatası: ${err.message}`);
            resolve();
        });
    });
}

async function startDownload() {
    console.log("Topografik harita indirmesi başlıyor, terminali kapatmayın...");
    for (let z = minZoom; z <= maxZoom; z++) {
        const minX = lon2tile(minLon, z);
        const maxX = lon2tile(maxLon, z);
        const minY = lat2tile(maxLat, z);
        const maxY = lat2tile(minLat, z);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                await downloadTile(z, x, y);
                // Topografik sunucu yavaştır, engellenmemek için 300ms bekleme süresi
                await delay(300); 
            }
        }
    }
    console.log("Tüm indirmeler tamamlandı.");
}

startDownload();