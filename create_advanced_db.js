const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 1. Veritabanı Dosyasını Hazırla
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'database.sqlite');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

if (fs.existsSync(dbPath)) {
    try {
        fs.unlinkSync(dbPath);
        console.log("🧹 Eski veritabanı temizlendi.");
    } catch (e) {
        console.log("⚠️ Veritabanı üzerine yazılıyor.");
    }
}
const db = new sqlite3.Database(dbPath);

const stages = [
    '1-hayatta-kalma',
    '2-yasami-devam-ettirme',
    '3-medeniyete-gecis'
];

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,      
            title TEXT NOT NULL,         
            content TEXT NOT NULL       
        )
    `);

    const stmt = db.prepare(`
        INSERT INTO articles (category, title, content)
        VALUES (?, ?, ?)
    `);
    
    let totalInserted = 0;
    console.log("\n📂 Klasörler taranıyor ve teknik üst kısımlar temizleniyor...");

    stages.forEach(stageFolder => {
        const stagePath = path.join(__dirname, stageFolder);
        if (!fs.existsSync(stagePath)) return;

        const files = fs.readdirSync(stagePath);
        
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(stagePath, file);
                let rawContent = fs.readFileSync(filePath, 'utf-8');
                
                const category = stageFolder.replace(/^\d+-/, '');
                let title = path.basename(file, '.md');

                // 🚀 KRİTİK MOBİL DÜZELTME: Front Matter (--- teknik üst kısım) temizleme mekanizması
                // Eğer dosyanın başında --- varsa, ikinci --- işaretine kadar olan yeri bulur ve keser
                if (rawContent.startsWith('---')) {
                    const parts = rawContent.split('---');
                    if (parts.length >= 3) {
                        // İlk iki '---' arasındaki teknik kodları hafızadan tamamen siler
                        // ve content alanına sadece temiz Markdown metnini bırakır
                        rawContent = parts.slice(2).join('---').trim();
                    }
                }

                // Dosya içindeki "# Başlık" satırını bul, temiz isim yap
                const titleMatch = rawContent.match(/^#\s+(.+)$/m);
                if (titleMatch && titleMatch[1]) {
                    title = titleMatch[1].trim();
                }

                stmt.run([category, title, rawContent]);
                totalInserted++;
                console.log(`[TEMİZLENDİ VE YAZILDI] Sınıf: ${category} | Başlık: ${title}`);
            }
        });
    });

    stmt.finalize();
    console.log(`\n==================================================`);
    console.log(`🎉 BAŞARILI: ${totalInserted} makale üst kısımları temizlenerek veritabanına kalıcı işlendi!`);
    console.log(`==================================================\n`);
});

db.close();
