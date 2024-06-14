// Importa a biblioteca Chai para asserções
const { expect } = require('chai');
// Importa a biblioteca nock para interceptar requisições HTTP
const nock = require('nock');
// Importa a função verifyNews do serviço de notícias
const { verifyNews } = require('../src/services/newsService');

// Define a suite de testes para o serviço de notícias
describe('News Service', () => {
    // Antes de todos os testes, configura o nock para interceptar a requisição ao News API
    before(() => {
        nock('https://newsapi.org')
            .get('/v2/everything') // Intercepta requisições GET para /v2/everything
            .query(true) // Permite qualquer query string
            .reply(200, { // Responde com um código 200 e um corpo JSON
                status: 'ok',
                totalResults: 2,
                articles: [
                    { title: 'Notícia 1', description: 'Descrição 1' },
                    { title: 'Notícia 2', description: 'Descrição 2' }
                ]
            });
    });

    // Teste para verificar se a função retorna artigos de notícias com base na consulta
    it('should return news articles based on the query', async () => {
        const query = 'test'; // Define uma consulta de teste
        const result = await verifyNews(query); // Chama a função verifyNews com a consulta
        expect(result.status).to.equal('ok'); // Verifica se o status da resposta é 'ok'
        expect(result.totalResults).to.equal(2); // Verifica se o total de resultados é 2
        expect(result.articles).to.be.an('array').that.has.lengthOf(2); // Verifica se os artigos são um array com 2 itens
    });
});
