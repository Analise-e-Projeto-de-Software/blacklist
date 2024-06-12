const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const checkURL = require('../middleware/urlChecker');
const { verifyNews } = require('../services/newsService');

const db = new sqlite3.Database('./database/blacklist.db');

// Rota raiz para servir o arquivo HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Endpoint para análise de e-mails
router.post('/analyze-email', (req, res) => {
    const { email, header, body } = req.body;

    // Lógica de análise do e-mail
    const isSuspicious = analyzeEmail(email, header, body);

    db.run(`INSERT INTO emails (email, header, body, is_suspicious) VALUES (?, ?, ?, ?)`, [email, header, body, isSuspicious], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, isSuspicious });
    });
});

// Endpoint para verificar URL
router.get('/check-url', checkURL, (req, res) => {
    res.json({ message: 'URL segura.' });
});

// Endpoint para verificar credibilidade de notícias
router.get('/verify-news', async (req, res) => {
    const { query } = req.query;

    try {
        const newsData = await verifyNews(query);
        res.json(newsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function analyzeEmail(email, header, body) {
    const suspiciousDomains = ['suspicious.com', 'malicious.org'];
    const emailDomain = email.split('@')[1];
    if (suspiciousDomains.includes(emailDomain)) {
        return 1;
    }

    const suspiciousKeywords = ['prêmio', 'ganhou', 'clique aqui'];
    for (const keyword of suspiciousKeywords) {
        if (body.includes(keyword)) {
            return 1;
        }
    }

    const suspiciousHeaderIndicators = ['X-Spam', 'X-Malicious'];
    for (const indicator of suspiciousHeaderIndicators) {
        if (header.includes(indicator)) {
            return 1;
        }
    }

    return 0;
}

module.exports = { router, analyzeEmail };
