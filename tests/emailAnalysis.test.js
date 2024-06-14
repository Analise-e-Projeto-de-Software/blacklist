const { expect } = require('chai');
const { analyzeEmail } = require('../src/routes/index');

describe('Email Analysis', () => {
    it('should mark email as suspicious if the domain is in the suspicious list', async () => {
        const result = await analyzeEmail('test@suspicious.com', '', '');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('Domínio do e-mail é suspeito');
    });

    it('should mark email as suspicious if the body contains suspicious keywords', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Você ganhou um prêmio!');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O corpo do e-mail contém uma palavra-chave suspeita: "prêmio"');
    });

    it('should mark email as suspicious if the header contains suspicious indicators', async () => {
        const result = await analyzeEmail('test@example.com', 'X-Spam: yes', '');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O cabeçalho do e-mail contém um indicador suspeito: "X-Spam"');
    });

    it('should mark email as suspicious if the body contains a non-HTTPS link', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Clique aqui: http://example.com');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O corpo do e-mail contém um link que não usa HTTPS');
    });

    it('should mark email as suspicious if it contains suspicious attachments', async () => {
        const result = await analyzeEmail('test@example.com', '', '', ['malware.exe']);
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O e-mail contém um anexo suspeito: "malware.exe"');
    });

    it('should not mark email as suspicious if it passes all checks', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Mensagem segura', []);
        expect(result.isSuspicious).to.equal(0);
        expect(result.details).to.include('O e-mail parece seguro');
    });
});
