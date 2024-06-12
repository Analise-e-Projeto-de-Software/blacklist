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

    db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.close();
