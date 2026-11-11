// Seed script to import all 27 .md files into SQLite database
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/database.sqlite');

db.serialize(() => {
    // Ensure table exists
    db.run("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, category TEXT, title TEXT, content TEXT, tags TEXT)");

    const phases = ['1-hayatta-kalma', '2-yasami-devam-ettirme', '3-medeniyete-gecis'];
    let total = 0;

    phases.forEach(phase => {
        const dir = './' + phase;
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        console.log('Processing phase: ' + phase + ' - ' + files.length + ' files');

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            // Parse new format (Malzemeler, Adım Adım Yapılışı, etc.)
            const lines = fileContent.trim().split('\n');
            const sections = { materials: '', steps: '', safety: '', disadvantages: '' };
            const headerRegex = /^(Malzemeler|Adım Adım Yapılışı|Güvenlik Uyarıları|Dezavantajlı Gruplar İçin İpuçları)$/m;
            let currentSection = null;

            lines.forEach(line => {
                const trimmed = line.trim();
                if (headerRegex.test(trimmed)) {
                    currentSection = trimmed;
                    switch (trimmed) {
                        case 'Malzemeler': currentSection = 'materials'; break;
                        case 'Adım Adım Yapılışı': currentSection = 'steps'; break;
                        case 'Güvenlik Uyarıları': currentSection = 'safety'; break;
                        case 'Dezavantajlı Gruplar İçin İpuçları': currentSection = 'disadvantages'; break;
                    }
                    return;
                }
                if (currentSection && trimmed) {
                    sections[currentSection] += trimmed + ' ';
                }
            });

            const id = file.replace('.md', '');
            const title = sections.steps ? sections.steps.substring(0, 50) + (sections.steps.length > 50 ? '...' : '') : file;
            const tags = ['hayatta', 'kalma'].join(',');

            const stmt = db.prepare("INSERT OR REPLACE INTO articles (id, category, title, content, tags) VALUES (?, ?, ?, ?, ?)");
            stmt.run(id, phase, title, fileContent, tags);
            total++;
            console.log('  Added: ' + title);
        });
    });

    console.log('\nTotal: ' + total + ' articles seeded.');
    db.close();
});

console.log('Seed script started...');