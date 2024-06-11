const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/blacklist.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        header TEXT,
        body TEXT,
        is_suspicious INTEGER DEFAULT 0
    )`);
    // Adicione mais tabelas conforme necessário
});

db.close();
