// Importa os módulos necessários
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { router: indexRouter } = require('./src/routes/index'); // Importa o roteador de index.js

// Cria uma instância do aplicativo Express
const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, usando a variável de ambiente ou 3000 por padrão

// Configura o banco de dados SQLite
const db = new sqlite3.Database('./database/blacklist.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message); // Loga um erro caso a conexão falhe
    } else {
        console.log('Conectado ao banco de dados SQLite.'); // Loga uma mensagem de sucesso na conexão
    }
});

// Configura o middleware para servir arquivos estáticos (CSS, JavaScript, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configura o middleware para analisar o corpo das requisições em JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Usa as rotas definidas em indexRouter para a rota raiz
app.use('/', indexRouter);

// Inicia o servidor e faz com que ele ouça na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`); // Loga uma mensagem quando o servidor estiver funcionando
});

// Exporta o aplicativo Express para uso em outros módulos (por exemplo, em testes)
module.exports = app;
