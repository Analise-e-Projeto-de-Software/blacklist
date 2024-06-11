const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/blacklist.db');

// Rota raiz para servir o arquivo HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Endpoint para análise de e-mails
router.post('/analyze-email', (req, res) => {
    const { email, header, body } = req.body;

    // Lógica de análise do e-mail
    const isSuspicious = analyzeEmail(header, body);

    db.run(`INSERT INTO emails (email, header, body, is_suspicious) VALUES (?, ?, ?, ?)`, [email, header, body, isSuspicious], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, isSuspicious });
    });
});

function analyzeEmail(header, body) {
    // Implementar lógica de análise
    // Retornar 1 se suspeito, 0 caso contrário
    return Math.random() > 0.5 ? 1 : 0; // Exemplo simples
}

module.exports = router;
