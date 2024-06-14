const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config();

const checkURL = require('../middleware/urlChecker');
const { verifyNews } = require('../services/newsService');
const { logActivity } = require('../services/logService');

const db = new sqlite3.Database('./database/blacklist.db');
const vtApiKey = process.env.VT_API_KEY;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

router.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/email.html'));
});

router.get('/url', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/url.html'));
});

router.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/news.html'));
});

router.get('/relatorio', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/relatorio.html'));
});

router.get('/logs', (req, res) => {
    console.log('Received request for logs');
    db.all('SELECT * FROM logs ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            console.error('Erro ao obter logs:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('Logs obtidos:', rows);
        res.json(rows);
    });
});



router.post('/analyze-email', async (req, res) => {
    const { email, header, body } = req.body;

    const result = await analyzeEmail(email, header, body);

    db.run(`INSERT INTO emails (email, header, body, is_suspicious) VALUES (?, ?, ?, ?)`, [email, header, body, result.isSuspicious], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        logActivity(`Email analisado: ${email} - Suspeito: ${result.isSuspicious}`);
        res.json({ id: this.lastID, isSuspicious: result.isSuspicious, details: result.details });
    });
});

router.get('/check-url', checkURL, async (req, res) => {
    try {
        const url = req.query.url;
        // Simulação de verificação de URL - substitua pelo seu próprio processo de verificação
        const isSafe = true; // Exemplo de resultado da verificação
        const message = isSafe ? 'URL segura.' : 'URL suspeita.';

        await logActivity(`URL verificada: ${url} - Resultado: ${message}`);
        res.json({ message });
    } catch (error) {
        await logActivity(`Erro ao verificar URL: ${req.query.url} - ${error.message}`);
        res.status(500).json({ error: 'Erro ao verificar URL.' });
    }
});

router.get('/verify-news', async (req, res) => {
    const { query } = req.query;
    try {
        const result = await verifyNews(query);
        await logActivity(`Notícia verificada: ${query} - Resultados encontrados: ${result.totalResults}`);
        res.json(result);
    } catch (error) {
        console.error('Erro ao verificar notícias:', error.message);
        await logActivity(`Erro ao verificar notícias: ${query} - ${error.message}`);
        res.status(500).json({ error: 'Erro ao verificar notícias.' });
    }
});

async function analyzeEmail(email, header, body, attachments = []) {
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

    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = body.match(urlRegex) || [];
    for (const url of urls) {
        const urlDomain = new URL(url).hostname;
        const isReputationSafe = await checkDomainReputation(urlDomain);
        if (!isReputationSafe) {
            details.push(`O corpo do e-mail contém um link para um domínio suspeito: "${urlDomain}"`);
            return { isSuspicious: 1, details };
        }
    }

    for (const url of urls) {
        if (!url.startsWith('https')) {
            details.push('O corpo do e-mail contém um link que não usa HTTPS');
            return { isSuspicious: 1, details };
        }
    }

    const suspiciousAttachments = ['.exe', '.bat', '.cmd'];
    for (const attachment of attachments) {
        if (suspiciousAttachments.some(ext => attachment.endsWith(ext))) {
            details.push(`O e-mail contém um anexo suspeito: "${attachment}"`);
            return { isSuspicious: 1, details };
        }
    }

    details.push('O e-mail parece seguro');
    return { isSuspicious: 0, details };
}

async function checkDomainReputation(domain) {
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { 'x-apikey': vtApiKey }
        });
        const data = response.data;
        return data.data.attributes.last_analysis_stats.malicious === 0;
    } catch (error) {
        console.error('Erro ao verificar reputação do domínio:', error.message);
        return false;
    }
}

module.exports = { router, analyzeEmail };
