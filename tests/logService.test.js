const { expect } = require('chai');
const sqlite3 = require('sqlite3').verbose();
const { logActivity } = require('../src/services/logService');

describe('Log Service', () => {
    let db;

    before((done) => {
        db = new sqlite3.Database('./database/blacklist.db', done);
    });

    after((done) => {
        db.close(done);
    });

    it('should log activities to the database', (done) => {
        logActivity('Test activity', (err) => {
            expect(err).to.be.null;

            db.get('SELECT * FROM logs WHERE activity = ?', ['Test activity'], (err, row) => {
                expect(err).to.be.null;
                expect(row).to.not.be.undefined;
                expect(row.activity).to.equal('Test activity');
                done();
            });
        });
    });
});
