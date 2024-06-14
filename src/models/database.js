// Importa a biblioteca SQLite3 e habilita o modo verbose para logar operações do banco de dados
const sqlite3 = require('sqlite3').verbose();
// Abre uma conexão com o banco de dados 'blacklist.db'
const db = new sqlite3.Database('./database/blacklist.db');

// Executa uma série de comandos SQL de forma sequencial
db.serialize(() => {
    // Cria a tabela 'emails' se ela não existir
    db.run(`CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT, // ID único para cada email
        email TEXT NOT NULL, // Endereço de email
        header TEXT, // Cabeçalho do email
        body TEXT, // Corpo do email
        is_suspicious INTEGER DEFAULT 0 // Indicador se o email é suspeito (0 = não, 1 = sim)
    )`);

    // Cria a tabela 'logs' se ela não existir
    db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, // ID único para cada log
        activity TEXT NOT NULL, // Descrição da atividade
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP // Timestamp da atividade, padrão para o tempo atual
    )`);
});

// Fecha a conexão com o banco de dados
db.close();
