const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const checkURL = require('../middleware/urlChecker');
const { verifyNews } = require('../services/newsService');
const { logActivity } = require('../services/logService');

const db = new sqlite3.Database('./database/blacklist.db');

// Rota raiz para servir o arquivo HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Endpoint para análise de e-mails
router.post('/analyze-email', (req, res) => {
    const { email, header, body } = req.body;

    // Lógica de análise do e-mail
    const result = analyzeEmail(email, header, body);

    db.run(`INSERT INTO emails (email, header, body, is_suspicious) VALUES (?, ?, ?, ?)`, [email, header, body, result.isSuspicious], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Registrar log de atividade
        logActivity(`Email analisado: ${email} - Suspeito: ${result.isSuspicious}`);
        res.json({ id: this.lastID, isSuspicious: result.isSuspicious, details: result.details });
    });
});

function analyzeEmail(email, header, body) {
    const details = [];
    const suspiciousDomains = ['suspicious.com', 'malicious.org'];
    const emailDomain = email.split('@')[1];
    if (suspiciousDomains.includes(emailDomain)) {
        details.push('Domínio do e-mail é suspeito');
        return { isSuspicious: 1, details };
    }

    const suspiciousKeywords = ['prêmio', 'ganhou', 'clique aqui'];
    for (const keyword of suspiciousKeywords) {
        if (body.includes(keyword)) {
            details.push(`O corpo do e-mail contém uma palavra-chave suspeita: "${keyword}"`);
            return { isSuspicious: 1, details };
        }
    }

    const suspiciousHeaderIndicators = ['X-Spam', 'X-Malicious'];
    for (const indicator of suspiciousHeaderIndicators) {
        if (header.includes(indicator)) {
            details.push(`O cabeçalho do e-mail contém um indicador suspeito: "${indicator}"`);
            return { isSuspicious: 1, details };
        }
    }

    // Nova regra: Verificar links no corpo do e-mail
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = body.match(urlRegex) || [];
    const suspiciousUrlDomains = ['phishing.com', 'malicious.net'];
    for (const url of urls) {
        const urlDomain = new URL(url).hostname;
        if (suspiciousUrlDomains.includes(urlDomain)) {
            details.push(`O corpo do e-mail contém um link para um domínio suspeito: "${urlDomain}"`);
            return { isSuspicious: 1, details };
        }
        if (!url.startsWith('https')) {
            details.push('O corpo do e-mail contém um link que não usa HTTPS');
            return { isSuspicious: 1, details };
        }
    }

    // Nova regra: Verificar anexos (simulação)
    const suspiciousAttachments = ['.exe', '.bat', '.cmd'];
    const attachments = []; // Precisamos de uma forma de extrair os anexos do e-mail
    for (const attachment of attachments) {
        if (suspiciousAttachments.some(ext => attachment.endsWith(ext))) {
            details.push(`O e-mail contém um anexo suspeito: "${attachment}"`);
            return { isSuspicious: 1, details };
        }
    }

    details.push('O e-mail parece seguro');
    return { isSuspicious: 0, details };
}

module.exports = { router, analyzeEmail };
