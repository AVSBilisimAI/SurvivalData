const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Data klasörünü kontrol et ve yoksa oluştur
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

const db = new sqlite3.Database('./data/database.sqlite');

db.serialize(() => {
    // Tabloyu oluştur
    db.run("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, category TEXT, title TEXT, content TEXT, tags TEXT)");
    
    // İlk veriyi ekle
    const stmt = db.prepare("INSERT OR IGNORE INTO articles VALUES (?, ?, ?, ?, ?)");
    stmt.run('01-001', '01_SU_YONETIMI', 'Doğada Filtresiz Su Bulma', 'Terleme torbası, yosun sıkma ve hayvan izi takibi ile su bulma yöntemleri...', 'su, susuzluk, filtre, terleme, yosun');
    stmt.finalize();
});

db.close(() => {
    console.log("Veritabanı başarıyla oluşturuldu: data/database.sqlite");
});