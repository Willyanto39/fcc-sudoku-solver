const chai = require('chai');
const assert = chai.assert;

const messages = require('../constants/messages');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  suite('Test solver.validate()', () => {
    test('Puzzle with 81 Characters', (done) => {
      const validity = solver.validate(puzzlesAndSolutions[0][0]);

      assert.isTrue(validity.valid);
      done();
    });
    
    test('Puzzle with Invalid Characters', (done) => {
      const puzzleStringArr = puzzlesAndSolutions[0][0].split('');
      puzzleStringArr[0] = 'x';
      const puzzleString = puzzleStringArr.join('');
      const validity = solver.validate(puzzleString);

      assert.isFalse(validity.valid);
      assert.equal(validity.reason, messages.INVALID_CHARACTER);
      done();
    });

    test('Puzzle That is not 81 Characters Long', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0] + '3';
      const validity = solver.validate(puzzleString);

      assert.isFalse(validity.valid);
      assert.equal(validity.reason, messages.INCORRECT_LENGTH);
      done();
    });
  });

  suite('Test solver.checkRowPlacement()', () => {
    test('Valid Row Placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const rowPlacement = solver.checkRowPlacement(puzzleString, 'A', '4', 7);

      assert.isTrue(rowPlacement);
      done();
    });

    test('Invalid Row Placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const rowPlacement = solver.checkRowPlacement(puzzleString, 'A', '2', 1);

      assert.isFalse(rowPlacement);
      done();
    });
  });

  suite('Test solver.checkColumnPlacement()', () => {
    test('Valid Column Placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const columPlacement = solver.checkColPlacement(puzzleString, 'C', '1', 7);

      assert.isTrue(columPlacement);
      done();
    });

    test('Invalid Column Placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const columPlacement = solver.checkColPlacement(puzzleString, 'B', '1', 1);

      assert.isFalse(columPlacement);
      done();
    });
  });

  suite('Test solver.checkRegionPlacement()', () => {
    test('Valid Region Placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const regionPlacement = solver.checkRegionPlacement(puzzleString, 'B', '1', 9);

      assert.isTrue(regionPlacement);
      done();
    });

    test('Invalid Region Placement', (done) => {
      const puzzlestring = puzzlesAndSolutions[0][0];
      const regionPlacement = solver.checkRegionPlacement(puzzlestring, 'B', '2', 5);

      assert.isFalse(regionPlacement);
      done();
    });
  });

  suite('Test solver.solve()', () => {
    test('Valid Puzzle Pass the Solver', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const solution = solver.solve(puzzleString);

      assert.isOk(solution);
      done();
    });

    test('Invalid Puzzle Fail the Solver', (done) => {
      const puzzleStringArr = puzzlesAndSolutions[0][0].split('');
      puzzleStringArr[1] = '1';
      const puzzleString = puzzleStringArr.join('');

      const solution = solver.solve(puzzleString);
      
      assert.isNotOk(solution);
      done();
    });

    test('Solver Returns Expected Solution', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const solution = solver.solve(puzzleString);

      assert.equal(solution, puzzlesAndSolutions[0][1]);
      done();
    });
  });
});
