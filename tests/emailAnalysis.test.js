const { expect } = require('chai');
const { analyzeEmail } = require('../src/routes/index');

describe('Email Analysis', () => {
    it('should mark email as suspicious if the domain is in the suspicious list', () => {
        const email = 'user@suspicious.com';
        const header = '';
        const body = '';
        const result = analyzeEmail(email, header, body);
        expect(result).to.equal(1);
    });

    it('should mark email as suspicious if the body contains suspicious keywords', () => {
        const email = 'user@example.com';
        const header = '';
        const body = 'Você ganhou um prêmio, clique aqui!';
        const result = analyzeEmail(email, header, body);
        expect(result).to.equal(1);
    });

    it('should mark email as suspicious if the header contains suspicious indicators', () => {
        const email = 'user@example.com';
        const header = 'X-Spam: yes';
        const body = '';
        const result = analyzeEmail(email, header, body);
        expect(result).to.equal(1);
    });

    it('should not mark email as suspicious if it passes all checks', () => {
        const email = 'user@example.com';
        const header = '';
        const body = 'Olá, como você está?';
        const result = analyzeEmail(email, header, body);
        expect(result).to.equal(0);
    });
});
