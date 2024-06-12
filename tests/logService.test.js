const { expect } = require('chai');
const sqlite3 = require('sqlite3').verbose();
const { logActivity } = require('../src/services/logService');

describe('Log Service', () => {
    let db;

    before((done) => {
        db = new sqlite3.Database('./database/blacklist.db');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                activity TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, done);
        });
    });

    after((done) => {
        db.close(done);
    });

    it('should log activities to the database', (done) => {
        const activity = 'Test activity';
        logActivity(activity);

        setTimeout(() => {
            db.get(`SELECT * FROM logs WHERE activity = ?`, [activity], (err, row) => {
                expect(err).to.be.null;
                expect(row).to.have.property('activity', activity);
                done();
            });
        }, 100); // Delay to ensure logActivity function has completed
    });
});
