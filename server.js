const express = require('express');
const { simpleParser } = require('mailparser');
const { parse } = require('node-html-parser');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para análise de e-mails
app.post('/analyze', async (req, res) => {
    const mailContent = req.body.mail; // Supondo que o corpo do e-mail seja enviado na requisição

    try {
        const parsedMail = await simpleParser(mailContent);
        const headers = parsedMail.headers;
        const content = parsedMail.text;
        const root = parse(content);
        const suspiciousContent = root.querySelectorAll('script, iframe, object');

        res.json({
            headers: Object.fromEntries(headers),
            suspiciousContent: suspiciousContent.length > 0 ? true : false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao analisar e-mail');
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
