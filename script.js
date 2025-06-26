let currentGrid = [];
let solution = [];

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function generateValidSudoku() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function solve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    grid[0][i] = numbers.splice(randomIndex, 1)[0];
  }

  solve(grid);
  return grid;
}

function createPuzzle(difficulty) {
  const solvedGrid = generateValidSudoku();
  const puzzle = solvedGrid.map(row => [...row]);

  const cellsToRemove =
    difficulty === 'easy' ? 10 :
    difficulty === 'medium' ? 20 :
    30;

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== '') {
      puzzle[row][col] = '';
      removed++;
    }
  }

  return { puzzle, solution: solvedGrid };
}

function startGame(difficulty) {
  const { puzzle, solution: newSolution } = createPuzzle(difficulty);
  currentGrid = puzzle;
  solution = newSolution;

  const gridElement = document.getElementById('sudoku-grid');
  gridElement.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'sudoku-cell';
      input.maxLength = 1;
      input.dataset.row = i;
      input.dataset.col = j;

      if (puzzle[i][j] !== '') {
        input.value = puzzle[i][j];
        input.disabled = true;
        input.setAttribute('data-fixed', 'true');
      }

      input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value === '' || /^[1-9]$/.test(value)) {
          currentGrid[i][j] = value === '' ? '' : parseInt(value);
        } else {
          e.target.value = '';
        }
      });

      gridElement.appendChild(input);
    }
  }

  showScreen('sudoku-screen');
}

function checkSudoku() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (currentGrid[i][j] !== solution[i][j]) {
        alert('Incorrect solution. Please try again!');
        return;
      }
    }
  }
  showScreen('congrats-screen');
}
