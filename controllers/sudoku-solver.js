const messages = require('../constants/messages');

const convertCoordinate = (row, column) => {
  const resultRow = row.toUpperCase().charCodeAt() - 'A'.charCodeAt();
  const resultColumn = Number(column) - 1;

  return [resultRow, resultColumn];
};

const transform = (puzzleString) => {
  const result = [];

  for (let i = 0; i < 9; i++) {
    const row = [...puzzleString].splice(i * 9, 9);

    row.forEach((value, index) => {
      if (value === '.') {
        row[index] = 0;
      } else {
        row[index] = Number(value);
      }
    });

    result.push(row);
  }

  return result;
};

const isAllowed = (grid, row, column, num) => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (grid[i][column] === num) {
      return false;
    }
  }

  const startRowIndex = Math.floor(row / 3) * 3;
  const startColumnIndex = Math.floor(column / 3) * 3;

  for (let i = startRowIndex; i < startRowIndex + 3; i++) {
    for (let j = startColumnIndex; j < startColumnIndex + 3; j++) {
      if (grid[i][j] === num) {
        return false;
      }
    }
  }

  return true;
};

// credit: geeksforgeeks.org/sudoku-backtracking/7 (Method 1: Simple)
const doSolve = (grid, row, column) => {
  if (row === 8 && column === 9 ) {
    return true;
  }

  if (column === 9) {
    row++;
    column = 0;
  }

  if (grid[row][column] != 0) {
    return doSolve(grid, row, column + 1);
  }

  for (let i = 1; i <= 9; i++) {
    if (isAllowed(grid, row, column, i)) {
      grid[row][column] = i;

      if (doSolve(grid, row, column + 1)) {
        return true;
      }
    }

    grid[row][column] = 0;
  }

  return false;
};

const toPuzzleString = (grid) => {
  return grid.flat().join('');
};

class SudokuSolver {

  validate(puzzleString) {
   if (puzzleString.length !== 81) {
     return {
       valid: false,
       reason: messages.INCORRECT_LENGTH
     };
   }

   const regex = /^[1-9|\.]+$/;

   if (!regex.test(puzzleString)) {
     return {
       valid: false,
       reason: messages.INVALID_CHARACTER
     };
   }

   return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = transform(puzzleString);
    const convertedCoordinate = convertCoordinate(row, column);
    const convertedRow = convertedCoordinate[0];
    const convertedColumn = convertedCoordinate[1];

    for (let i = 0; i < 9; i++) {
      if (i === convertedColumn) {
        continue;
      }

      if (grid[convertedRow][i] === value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = transform(puzzleString);
    const convertedCoordinate = convertCoordinate(row, column);
    const convertedRow = convertedCoordinate[0];
    const convertedColumn = convertedCoordinate[1];

    for (let i = 0; i < 9; i++) {
      if (i === convertedRow) {
        continue;
      }

      if (grid[i][convertedColumn] === value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = transform(puzzleString);
    const convertedCoordinate = convertCoordinate(row, column);
    const convertedRow = convertedCoordinate[0];
    const convertedColumn = convertedCoordinate[1];
    const startRowIndex = Math.floor(convertedRow / 3) * 3;
    const startColIndex = Math.floor(convertedColumn / 3) * 3;

    for (let i = startRowIndex; i < startRowIndex + 3; i++) {
      for (let j = startColIndex; j < startColIndex + 3; j++) {
        if (i === convertedRow && j === convertedColumn) {
          continue;
        }

        if (grid[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    const grid = transform(puzzleString);

    if (!doSolve(grid, 0, 0)) {
      return false;
    }

    return toPuzzleString(grid);
  }
}

module.exports = SudokuSolver;

