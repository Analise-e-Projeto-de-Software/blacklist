const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const indexRouter = require('./src/routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Configurar o banco de dados SQLite
const db = new sqlite3.Database('./database/blacklist.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Configurar middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar o middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Usar as rotas definidas em indexRouter
app.use('/', indexRouter);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
