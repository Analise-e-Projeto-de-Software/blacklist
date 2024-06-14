// Importa a biblioteca Chai para asserções
const { expect } = require('chai');
// Importa a biblioteca SQLite3 e habilita o modo verbose para logar operações do banco de dados
const sqlite3 = require('sqlite3').verbose();
// Importa a função logActivity do serviço de log
const { logActivity } = require('../src/services/logService');

// Define a suite de testes para o serviço de logs
describe('Log Service', () => {
    let db; // Variável para armazenar a conexão com o banco de dados

    // Antes de todos os testes, abre uma conexão com o banco de dados
    before((done) => {
        db = new sqlite3.Database('./database/blacklist.db', done);
    });

    // Depois de todos os testes, fecha a conexão com o banco de dados
    after((done) => {
        db.close(done);
    });

    // Teste para verificar se as atividades são registradas no banco de dados
    it('should log activities to the database', (done) => {
        // Chama a função logActivity para registrar uma atividade de teste
        logActivity('Test activity', (err) => {
            // Verifica se não houve erro ao registrar a atividade
            expect(err).to.be.null;

            // Consulta o banco de dados para verificar se a atividade foi registrada
            db.get('SELECT * FROM logs WHERE activity = ?', ['Test activity'], (err, row) => {
                // Verifica se não houve erro na consulta
                expect(err).to.be.null;
                // Verifica se a atividade foi encontrada
                expect(row).to.not.be.undefined;
                // Verifica se a atividade registrada é igual à atividade de teste
                expect(row.activity).to.equal('Test activity');
                done(); // Chama done para indicar que o teste foi concluído
            });
        });
    });
});
