const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error("Bağlantı hatası:", err.message);
        return;
    }
});

// Veritabanındaki tüm tablo isimlerini çeken SQL komutu
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
        console.error("Hata:", err.message);
    } else {
        console.log("📌 Veritabanındaki Tablolarınız:");
        rows.forEach((row) => {
            console.log("- " + row.name);
        });
    }
    db.close();
});