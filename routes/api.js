'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const messages = require('../constants/messages');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        const { puzzle, value, coordinate } = req.body;

        if (!puzzle || !value || !coordinate) {
          return res.json({ error: messages.MISSING_FIELDS });
        }

        const valueRegex = /^[1-9]$/;

        if (!valueRegex.test(value)) {
          return res.json({ error: messages.INVALID_VALUE });
        }

        const coordinateRegex = /^[A-I][1-9]$/i;

        if (!coordinateRegex.test(coordinate)) {
          return res.json({ error: messages.INVALID_COORDINATE });
        }

        const validity = solver.validate(puzzle);

        if (!validity.valid) {
          return res.json({ error: validity.reason });
        }

        const row = coordinate[0];
        const column = coordinate[1];

        /** 
         * convert value to number because check placement 
         * (row, column, and region will check whether numeric value exists)
        */
        const numericValue = Number(value);

        const rowPlacement = solver.checkRowPlacement(puzzle, row, column, numericValue);
        const columPlacement = solver.checkColPlacement(puzzle, row, column, numericValue);
        const regionPlacement = solver.checkRegionPlacement(puzzle, row, column, numericValue);
  
        const conflicts = [];
  
        if (!rowPlacement) {
          conflicts.push('row');
        }
 
        if (!columPlacement) {
          conflicts.push('column');
        }
  
        if (!regionPlacement) {
          conflicts.push('region');
        }

        const valid = conflicts.length === 0;
        const response = { valid };

        if (!valid) {
          response.conflict = conflicts;
        }

        return res.json(response);
      } catch(err) {
        return res.json({ error: err.message });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        const { puzzle } = req.body;

        if (!puzzle) {
          return res.json({ error: messages.MISSING_FIELD });
        }

        const validity = solver.validate(puzzle);

        if (!validity.valid) {
          return res.json({ error: validity.reason });
        }

        const solution = solver.solve(puzzle);

        if (!solution) {
          return res.json({ error: messages.NO_SOLUTION });
        }

        return res.json({ solution });
      } catch(err) {
        return res.json({ error: err.message });
      }
    });
};
