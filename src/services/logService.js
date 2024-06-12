const sqlite3 = require('sqlite3').verbose();

function logActivity(activity) {
    const db = new sqlite3.Database('./database/blacklist.db');
    db.run(`INSERT INTO logs (activity) VALUES (?)`, [activity], function(err) {
        if (err) {
            console.error('Erro ao registrar atividade:', err.message);
        } else {
            console.log('Atividade registrada:', activity);
        }
        db.close();
    });
}

module.exports = { logActivity };
