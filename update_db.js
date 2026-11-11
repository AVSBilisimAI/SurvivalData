const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const rawDir = './data/raw_articles';
const db = new sqlite3.Database('./data/database.sqlite');

// Windows (\r\n) ve Linux (\n) satır sonlarını tolere eden yeni fonksiyon
function parseMarkdownContent(fileContent) {
    // İçeriğin başındaki boşlukları temizle ve böl
    const cleanContent = fileContent.trim();
    // \r?\n kullanarak Windows uyumlu hale getirdik
    const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    
    if (!match) return null;

    const metaLines = match[1].split(/\r?\n/);
    const metadata = {};
    metaLines.forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value.length > 0) metadata[key.trim()] = value.join(':').trim();
    });

    return { metadata, content: match[2].trim() };
}

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, category TEXT, title TEXT, content TEXT, tags TEXT)");

    // Klasör var mı kontrol et
    if (!fs.existsSync(rawDir)) {
        console.log("HATA: raw_articles klasörü bulunamadı!");
        return;
    }

    const files = fs.readdirSync(rawDir).filter(file => file.endsWith('.md'));
    console.log(`Klasörde bulunan .md uzantılı dosya sayısı: ${files.length}`);
    
    let addedCount = 0;
    const stmt = db.prepare("INSERT OR REPLACE INTO articles (id, category, title, content, tags) VALUES (?, ?, ?, ?, ?)");

    files.forEach(file => {
        const fileContent = fs.readFileSync(path.join(rawDir, file), 'utf-8');
        const parsed = parseMarkdownContent(fileContent);

        if (parsed && parsed.metadata.id) {
            stmt.run(parsed.metadata.id, parsed.metadata.category, parsed.metadata.title, parsed.content, parsed.metadata.tags);
            addedCount++;
            console.log(`[BAŞARILI] Eklendi: ${parsed.metadata.title}`);
        } else {
            console.log(`[HATA] Bu dosyanın formatı hatalı (--- kısımlarını kontrol edin): ${file}`);
        }
    });

    stmt.finalize();
    console.log(`\nToplam ${addedCount} makale veritabanına başarıyla işlendi.`);
});

db.close();