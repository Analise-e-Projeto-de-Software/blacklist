// Importa a biblioteca axios para fazer requisições HTTP
const axios = require('axios');
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Obtém a chave da API de notícias e a URL base da API das variáveis de ambiente
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Função para verificar notícias com base em uma consulta.
 * 
 * @param {string} query - Consulta para pesquisar notícias.
 * @returns {Object} - Retorna os dados da resposta da API de notícias.
 * @throws {Error} - Lança um erro se a verificação falhar.
 */
async function verifyNews(query) {
    try {
        // Faz uma requisição GET para a API de notícias com a consulta fornecida
        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: query, // Consulta a ser pesquisada
                apiKey: NEWS_API_KEY // Chave da API
            }
        });
        return response.data; // Retorna os dados da resposta
    } catch (error) {
        console.error('Erro ao verificar notícia:', error); // Loga o erro no console
        throw new Error('Erro ao verificar notícia.'); // Lança um erro para ser tratado pelo chamador
    }
}

// Exporta a função verifyNews para uso em outras partes da aplicação
module.exports = { verifyNews };
