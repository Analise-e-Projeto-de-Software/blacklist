// Importa a biblioteca Chai para asserções
const { expect } = require('chai');
// Importa o framework Express
const express = require('express');
// Importa a biblioteca Supertest para testar aplicativos Express
const request = require('supertest');
// Importa o middleware de verificação de URL
const checkURL = require('../src/middleware/urlChecker');
// Importa a biblioteca Nock para interceptar requisições HTTP
const nock = require('nock');

// Cria uma instância do aplicativo Express
const app = express();
// Define a rota para verificar URLs, aplicando o middleware checkURL
app.use('/check-url', checkURL, (req, res) => {
    res.json({ message: 'URL segura.' });
});

// Define a suite de testes para o middleware de verificação de URLs
describe('URL Checker Middleware', () => {
    // Teste para bloquear URLs com domínios suspeitos
    it('should block URLs with suspicious domains', (done) => {
        request(app)
            .get('/check-url?url=http://phishing.com')
            .expect(400) // Espera um status 400 (Bad Request)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: domínio suspeito.');
            })
            .end(done);
    });

    // Teste para bloquear URLs com palavras-chave suspeitas
    it('should block URLs with suspicious keywords', (done) => {
        request(app)
            .get('/check-url?url=http://example.com/login')
            .expect(400) // Espera um status 400 (Bad Request)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: contém palavra-chave suspeita (login).');
            })
            .end(done);
    });

    // Teste para bloquear URLs que não usam HTTPS
    it('should block URLs that do not use HTTPS', (done) => {
        request(app)
            .get('/check-url?url=http://example.com')
            .expect(400) // Espera um status 400 (Bad Request)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: não utiliza HTTPS.');
            })
            .end(done);
    });

    // Teste para bloquear URLs encurtadas que redirecionam para domínios suspeitos
    it('should block shortened URLs that redirect to suspicious domains', (done) => {
        // Mocka a função de fetch para simular redirecionamento
        nock('http://bit.ly')
            .head('/suspicious')
            .reply(302, '', { Location: 'http://malicious.org' });

        request(app)
            .get('/check-url?url=http://bit.ly/suspicious')
            .expect(400) // Espera um status 400 (Bad Request)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: redireciona para um domínio suspeito.');
            })
            .end(done);
    });

    // Teste para permitir URLs seguras
    it('should allow safe URLs', (done) => {
        request(app)
            .get('/check-url?url=https://example.com')
            .expect(200) // Espera um status 200 (OK)
            .expect((res) => {
                expect(res.body.message).to.equal('URL segura.');
            })
            .end(done);
    });
});
