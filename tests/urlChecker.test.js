const { expect } = require('chai');
const express = require('express');
const request = require('supertest');
const checkURL = require('../src/middleware/urlChecker');
const nock = require('nock');

const app = express();
app.use('/check-url', checkURL, (req, res) => {
    res.json({ message: 'URL segura.' });
});

describe('URL Checker Middleware', () => {
    it('should block URLs with suspicious domains', (done) => {
        request(app)
            .get('/check-url?url=http://phishing.com')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: domínio suspeito.');
            })
            .end(done);
    });

    it('should block URLs with suspicious keywords', (done) => {
        request(app)
            .get('/check-url?url=http://example.com/login')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: contém palavra-chave suspeita (login).');
            })
            .end(done);
    });

    it('should block URLs that do not use HTTPS', (done) => {
        request(app)
            .get('/check-url?url=http://example.com')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: não utiliza HTTPS.');
            })
            .end(done);
    });

    it('should block shortened URLs that redirect to suspicious domains', (done) => {
        // Mock the fetch function to simulate redirection
        nock('http://bit.ly')
            .head('/suspicious')
            .reply(302, '', { Location: 'http://malicious.org' });

        request(app)
            .get('/check-url?url=http://bit.ly/suspicious')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).to.equal('URL suspeita detectada: redireciona para um domínio suspeito.');
            })
            .end(done);
    });

    it('should allow safe URLs', (done) => {
        request(app)
            .get('/check-url?url=https://example.com')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('URL segura.');
            })
            .end(done);
    });
});
