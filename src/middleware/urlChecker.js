const url = require('url');
const fetch = require('node-fetch');

// Lista de domínios suspeitos para exemplo
const suspiciousDomains = ['phishing.com', 'malicious.org'];

// Lista de palavras-chave suspeitas em URLs
const suspiciousKeywords = ['login', 'secure', 'account', 'update'];

async function checkURL(req, res, next) {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.url) {
        const parsedUrl = url.parse(queryObject.url);
        
        // Verificar se o domínio está na lista de suspeitos
        if (suspiciousDomains.includes(parsedUrl.hostname)) {
            return res.status(400).json({ message: 'URL suspeita detectada: domínio suspeito.' });
        }

        // Verificar se a URL contém palavras-chave suspeitas
        for (const keyword of suspiciousKeywords) {
            if (parsedUrl.pathname.includes(keyword)) {
                return res.status(400).json({ message: `URL suspeita detectada: contém palavra-chave suspeita (${keyword}).` });
            }
        }

        // Verificar se a URL utiliza HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return res.status(400).json({ message: 'URL suspeita detectada: não utiliza HTTPS.' });
        }

        // Verificar se a URL encurtada redireciona para um domínio suspeito
        if (parsedUrl.hostname.match(/bit\.ly|goo\.gl|t\.co/)) {
            const response = await fetch(queryObject.url, { method: 'HEAD', redirect: 'manual' });
            const finalUrl = response.headers.get('location');
            if (finalUrl) {
                const finalParsedUrl = url.parse(finalUrl);
                if (suspiciousDomains.includes(finalParsedUrl.hostname)) {
                    return res.status(400).json({ message: 'URL suspeita detectada: redireciona para um domínio suspeito.' });
                }
            }
        }
    }
    next();
}

module.exports = checkURL;
