const axios = require('axios');
require('dotenv').config();

const vtApiKey = process.env.VT_API_KEY;

const checkURL = async (req, res, next) => {
    let url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida.' });
    }

    // Adiciona o esquema http:// se estiver ausente
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }

    try {
        const urlDomain = new URL(url).hostname;
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${urlDomain}`, {
            headers: { 'x-apikey': vtApiKey }
        });
        const data = response.data;
        if (data.data.attributes.last_analysis_stats.malicious > 0) {
            return res.status(200).json({ message: `URL suspeita detectada: redireciona para um domínio suspeito (${urlDomain}).` });
        }
        if (!url.startsWith('https')) {
            return res.status(200).json({ message: 'URL suspeita detectada: não utiliza HTTPS.' });
        }
        next();
    } catch (error) {
        console.error('Erro ao verificar reputação da URL:', error.message);
        return res.status(500).json({ error: 'Erro ao verificar a URL.' });
    }
};

module.exports = checkURL;
