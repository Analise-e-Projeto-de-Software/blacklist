// Importa a biblioteca SQLite3 e habilita o modo verbose para logar operações do banco de dados
const sqlite3 = require('sqlite3').verbose();

/**
 * Função para registrar atividades no banco de dados.
 * 
 * @param {string} activity - Descrição da atividade a ser registrada.
 * @param {function} [callback] - Função de callback opcional para ser chamada após o registro.
 */
function logActivity(activity, callback) {
    // Abre uma conexão com o banco de dados 'blacklist.db'
    const db = new sqlite3.Database('./database/blacklist.db');
    // Insere a atividade na tabela 'logs'
    db.run('INSERT INTO logs (activity) VALUES (?)', [activity], function (err) {
        // Fecha a conexão com o banco de dados
        db.close();
        // Se um callback for fornecido, chama o callback com o erro (se houver)
        if (callback) {
            callback(err);
        }
    });
}

// Exporta a função logActivity para uso em outras partes da aplicação
module.exports = { logActivity };
