// Importa os módulos necessários
const express = require('express');
const router = express.Router(); // Cria um roteador para gerenciar as rotas
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Importa middleware e serviços
const checkURL = require('../middleware/urlChecker');
const { verifyNews } = require('../services/newsService');
const { logActivity } = require('../services/logService');

// Abre uma conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database/blacklist.db');
const vtApiKey = process.env.VT_API_KEY; // Obtém a chave da API VirusTotal das variáveis de ambiente

// Rota raiz para servir o arquivo HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Endpoint para análise de e-mails
router.post('/analyze-email', async (req, res) => {
    const { email, header, body } = req.body;

    // Lógica de análise do e-mail
    const result = await analyzeEmail(email, header, body);

    // Insere os resultados da análise no banco de dados
    db.run(`INSERT INTO emails (email, header, body, is_suspicious) VALUES (?, ?, ?, ?)`, [email, header, body, result.isSuspicious], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Registrar log de atividade
        logActivity(`Email analisado: ${email} - Suspeito: ${result.isSuspicious}`);
        res.json({ id: this.lastID, isSuspicious: result.isSuspicious, details: result.details });
    });
});

// Endpoint para verificação de URL
router.get('/check-url', checkURL, (req, res) => {
    logActivity(`URL verificada: ${req.query.url}`);
    res.json({ message: 'URL segura.' });
});

// Endpoint para verificação de notícias
router.get('/verify-news', async (req, res) => {
    const { query } = req.query;
    try {
        const result = await verifyNews(query);
        res.json(result);
    } catch (error) {
        console.error('Erro ao verificar notícias:', error.message);
        res.status(500).json({ error: 'Erro ao verificar notícias.' });
    }
});

// Endpoint para logs
router.get('/logs', (req, res) => {
    db.all('SELECT * FROM logs ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Função para analisar o e-mail
async function analyzeEmail(email, header, body, attachments = []) {
    const details = [];
    const suspiciousDomains = ['suspicious.com', 'malicious.org'];
    const emailDomain = email.split('@')[1];

    // Verifica se o domínio do e-mail é suspeito
    if (suspiciousDomains.includes(emailDomain)) {
        details.push('Domínio do e-mail é suspeito');
        console.log('Domínio suspeito detectado:', details);
        return { isSuspicious: 1, details };
    }

    // Verifica se o corpo do e-mail contém palavras-chave suspeitas
    const suspiciousKeywords = ['prêmio', 'ganhou', 'clique aqui'];
    for (const keyword of suspiciousKeywords) {
        if (body.includes(keyword)) {
            details.push(`O corpo do e-mail contém uma palavra-chave suspeita: "${keyword}"`);
            console.log('Palavra-chave suspeita detectada:', details);
            return { isSuspicious: 1, details };
        }
    }

    // Verifica se o cabeçalho do e-mail contém indicadores suspeitos
    const suspiciousHeaderIndicators = ['X-Spam', 'X-Malicious'];
    for (const indicator of suspiciousHeaderIndicators) {
        if (header.includes(indicator)) {
            details.push(`O cabeçalho do e-mail contém um indicador suspeito: "${indicator}"`);
            console.log('Indicador de cabeçalho suspeito detectado:', details);
            return { isSuspicious: 1, details };
        }
    }

    // Verifica links no corpo do e-mail
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = body.match(urlRegex) || [];
    for (const url of urls) {
        const urlDomain = new URL(url).hostname;
        const isReputationSafe = await checkDomainReputation(urlDomain);
        if (!isReputationSafe) {
            details.push(`O corpo do e-mail contém um link para um domínio suspeito: "${urlDomain}"`);
            console.log('Link suspeito detectado:', details);
            return { isSuspicious: 1, details };
        }
    }

    // Verifica se os links usam HTTPS
    for (const url of urls) {
        if (!url.startsWith('https')) {
            details.push('O corpo do e-mail contém um link que não usa HTTPS');
            console.log('Link não HTTPS detectado:', details);
            return { isSuspicious: 1, details };
        }
    }

    // Verifica anexos (simulação)
    const suspiciousAttachments = ['.exe', '.bat', '.cmd'];
    for (const attachment of attachments) {
        if (suspiciousAttachments.some(ext => attachment.endsWith(ext))) {
            details.push(`O e-mail contém um anexo suspeito: "${attachment}"`);
            console.log('Anexo suspeito detectado:', details);
            return { isSuspicious: 1, details };
        }
    }

    details.push('O e-mail parece seguro');
    console.log('E-mail seguro:', details);
    return { isSuspicious: 0, details };
}

// Função para verificar a reputação do domínio usando a API VirusTotal
async function checkDomainReputation(domain) {
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { 'x-apikey': vtApiKey }
        });
        const data = response.data;
        if (data.data.attributes.last_analysis_stats.malicious > 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar reputação do domínio:', error.message);
        return false;
    }
}

// Exporta o roteador e a função analyzeEmail
module.exports = { router, analyzeEmail };
