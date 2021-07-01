const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');
const messages = require('../constants/messages');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Test POST /api/solve', () => {
    test('Valid Puzzle String', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Missing Puzzle String', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.MISSING_FIELD);
          done();
        });
    });

    test('Invalid Characters', (done) => {
      const puzzleStringArr = puzzlesAndSolutions[0][0].split('');
      puzzleStringArr[0] = 'x';
      const puzzleString = puzzleStringArr.join('');

      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INVALID_CHARACTER);
          done();
        });
    });

    test('Invalid Length', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: 'a' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INCORRECT_LENGTH);
          done();
        });
    });

    test('Unsolvable Puzzle', (done) => {
      const puzzleStringArr = puzzlesAndSolutions[0][0].split('');
      puzzleStringArr[1] = '1';
      const puzzleString = puzzleStringArr.join('');

      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.NO_SOLUTION);
          done();
        });
    });
  });

  suite('Test POST /api/check', () => {
    test('All Fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'C1',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Single Placement Conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'C9',
          value: '1'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });

    test('Multiple Placement Conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B2',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });

    test('All Placement Conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B5',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });

    test('Missing Required Fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          coordinate: 'B7',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.MISSING_FIELDS);
          done();
        });
    });

    test('Invalid Character', (done) => {
      const puzzleStringArr = puzzlesAndSolutions[0][0].split('');
      puzzleStringArr[0] = 'x';
      const puzzleString = puzzleStringArr.join('');

      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'A4',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INVALID_CHARACTER);
          done();
        });
    });

    test('Incorrect Length', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0] + '8';

      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'A1',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INCORRECT_LENGTH);
          done();
        });
    });

    test('Invalid Coordinate', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'Z5',
          value: '6'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INVALID_COORDINATE);
          done();
        });
    });

    test('Invalid Value', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'F5',
          value: 'a'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, messages.INVALID_VALUE);
          done();
        });
    });
  });
});

