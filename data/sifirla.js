const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı (database.sqlite ile aynı klasörde çalıştırılacak)
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error("Veritabanına bağlanırken hata oluştu:", err.message);
        return;
    }
});

// encyclopedia tablosunu boşalt ve ID sayacını sıfırla
const sql = `
    DELETE FROM encyclopedia;
    DELETE FROM sqlite_sequence WHERE name='encyclopedia';
`;

db.exec(sql, (err) => {
    if (err) {
        console.error("Sıfırlama sırasında hata:", err.message);
    } else {
        console.log("✅ Kategori ve içerik verileri (encyclopedia) tamamen sıfırlandı.");
        console.log("⚠️ Harita (PMTiles) altyapısına dokunulmadı.");
    }
    
    db.close();
});