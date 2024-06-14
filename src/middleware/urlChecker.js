// Importa a biblioteca axios para fazer requisições HTTP
const axios = require('axios');
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Obtém a chave da API VirusTotal das variáveis de ambiente
const vtApiKey = process.env.VT_API_KEY;

// Middleware para verificar URLs
const checkURL = async (req, res, next) => {
    // Obtém a URL da query string da requisição
    let url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida.' }); // Retorna erro se a URL não for fornecida
    }

    // Adiciona o esquema http:// se estiver ausente
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }

    try {
        // Extrai o domínio da URL
        const urlDomain = new URL(url).hostname;
        // Faz uma requisição para a API VirusTotal para verificar a reputação do domínio
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${urlDomain}`, {
            headers: { 'x-apikey': vtApiKey }
        });
        const data = response.data;
        // Verifica se a análise da URL detectou conteúdo malicioso
        if (data.data.attributes.last_analysis_stats.malicious > 0) {
            return res.status(200).json({ message: `URL suspeita detectada: redireciona para um domínio suspeito (${urlDomain}).` });
        }
        // Verifica se a URL não utiliza HTTPS
        if (!url.startsWith('https')) {
            return res.status(200).json({ message: 'URL suspeita detectada: não utiliza HTTPS.' });
        }
        // Se a URL passar nas verificações, chama o próximo middleware
        next();
    } catch (error) {
        console.error('Erro ao verificar reputação da URL:', error.message); // Loga o erro no console
        return res.status(500).json({ error: 'Erro ao verificar a URL.' }); // Retorna erro se a verificação falhar
    }
};

// Exporta o middleware para uso em outras partes da aplicação
module.exports = checkURL;
