const { expect } = require('chai');
const nock = require('nock');
const { verifyNews } = require('../src/services/newsService');

describe('News Service', () => {
    before(() => {
        // Configurar o nock para interceptar a requisição ao News API
        nock('https://newsapi.org')
            .get('/v2/everything')
            .query(true)
            .reply(200, {
                status: 'ok',
                totalResults: 2,
                articles: [
                    { title: 'Notícia 1', description: 'Descrição 1' },
                    { title: 'Notícia 2', description: 'Descrição 2' }
                ]
            });
    });

    it('should return news articles based on the query', async () => {
        const query = 'test';
        const result = await verifyNews(query);
        expect(result.status).to.equal('ok');
        expect(result.totalResults).to.equal(2);
        expect(result.articles).to.be.an('array').that.has.lengthOf(2);
    });
});
