// Importa a biblioteca Chai para asserções
const { expect } = require('chai');
// Importa a função analyzeEmail do arquivo de rotas
const { analyzeEmail } = require('../src/routes/index');

// Define a suite de testes para análise de e-mails
describe('Email Analysis', () => {
    // Teste para verificar se o email é marcado como suspeito se o domínio estiver na lista de suspeitos
    it('should mark email as suspicious if the domain is in the suspicious list', async () => {
        const result = await analyzeEmail('test@suspicious.com', '', '');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('Domínio do e-mail é suspeito');
    });

    // Teste para verificar se o email é marcado como suspeito se o corpo contiver palavras-chave suspeitas
    it('should mark email as suspicious if the body contains suspicious keywords', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Você ganhou um prêmio!');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O corpo do e-mail contém uma palavra-chave suspeita: "prêmio"');
    });

    // Teste para verificar se o email é marcado como suspeito se o cabeçalho contiver indicadores suspeitos
    it('should mark email as suspicious if the header contains suspicious indicators', async () => {
        const result = await analyzeEmail('test@example.com', 'X-Spam: yes', '');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O cabeçalho do e-mail contém um indicador suspeito: "X-Spam"');
    });

    // Teste para verificar se o email é marcado como suspeito se o corpo contiver links não HTTPS
    it('should mark email as suspicious if the body contains a non-HTTPS link', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Clique aqui: http://example.com');
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O corpo do e-mail contém um link que não usa HTTPS');
    });

    // Teste para verificar se o email é marcado como suspeito se contiver anexos suspeitos
    it('should mark email as suspicious if it contains suspicious attachments', async () => {
        const result = await analyzeEmail('test@example.com', '', '', ['malware.exe']);
        expect(result.isSuspicious).to.equal(1);
        expect(result.details).to.include('O e-mail contém um anexo suspeito: "malware.exe"');
    });

    // Teste para verificar se o email não é marcado como suspeito se passar em todas as verificações
    it('should not mark email as suspicious if it passes all checks', async () => {
        const result = await analyzeEmail('test@example.com', '', 'Mensagem segura', []);
        expect(result.isSuspicious).to.equal(0);
        expect(result.details).to.include('O e-mail parece seguro');
    });
});
