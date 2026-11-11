const fs = require('fs');
const initSqlJs = require('./assets/js/sql-wasm.js');

async function exportDbToJs() {
    const SQL = await initSqlJs({
        locateFile: file => `./assets/js/${file}`
    });

    const dbBuffer = fs.readFileSync('./data/database.sqlite');
    const db = new SQL.Database(dbBuffer);

    const stmt = db.prepare("SELECT * FROM articles ORDER BY title ASC");
    const articles = [];

    while (stmt.step()) {
        articles.push(stmt.getAsObject());
    }

    const jsContent = "window.OFFLINE_ARTICLES = " + JSON.stringify(articles) + ";";
    fs.writeFileSync('./data/articles_data.js', jsContent, 'utf8');

    console.log("Basarili! Toplam " + articles.length + " makale ./data/articles_data.js dosyasina aktarildi.");
}

exportDbToJs();
