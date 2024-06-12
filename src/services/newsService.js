const axios = require('axios');
require('dotenv').config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

async function verifyNews(query) {
    try {
        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: query,
                apiKey: NEWS_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar notícia:', error);
        throw new Error('Erro ao verificar notícia.');
    }
}

module.exports = { verifyNews };
