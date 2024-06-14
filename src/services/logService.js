const sqlite3 = require('sqlite3').verbose();

function logActivity(activity, callback) {
    const db = new sqlite3.Database('./database/blacklist.db');
    db.run('INSERT INTO logs (activity) VALUES (?)', [activity], function(err) {
        db.close();
        if (callback) {
            callback(err);
        }
    });
}

module.exports = { logActivity };
