const board = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const bestScoresList = document.getElementById('best-scores');
let currentPlayer = 'X';
let gameOver = false;
let startTime;

// Cargar mejores tiempos al iniciar
loadBestScores();

// Iniciar el juego y registrar el tiempo
board.forEach(cell => {
  cell.addEventListener('click', handlePlayerMove);
});

restartButton.addEventListener('click', resetGame);

function handlePlayerMove(event) {
  if (gameOver) return;

  const cell = event.target;
  const cellIndex = cell.dataset.index;

  if (cell.textContent === '') {
    cell.textContent = currentPlayer;

    if (!startTime) startTime = new Date();

    if (checkWin()) {
      endGame(`${currentPlayer} gana`);
      recordScore();
    } else if (isDraw()) {
      endGame('Es un empate');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === 'O') setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  const emptyCells = Array.from(board).filter(cell => cell.textContent === '');
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  if (randomCell) {
    randomCell.textContent = 'O';
    if (checkWin()) {
      endGame('O gana');
    } else if (isDraw()) {
      endGame('Es un empate');
    } else {
      currentPlayer = 'X';
    }
  }
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a].textContent === currentPlayer &&
           board[a].textContent === board[b].textContent &&
           board[a].textContent === board[c].textContent;
  });
}

function isDraw() {
  return Array.from(board).every(cell => cell.textContent !== '');
}

function endGame(message) {
  gameOver = true;
  setTimeout(() => alert(message), 100);
}

function resetGame() {
  board.forEach(cell => (cell.textContent = ''));
  currentPlayer = 'X';
  gameOver = false;
  startTime = null;
}

function recordScore() {
  if (currentPlayer === 'X') {
    const endTime = new Date();
    const scoreTime = Math.floor((endTime - startTime) / 1000);
    const playerName = prompt("Ganaste! Ingresa tu nombre:");
    const scoreEntry = { name: playerName, time: scoreTime, date: new Date().toLocaleString() };
    saveScore(scoreEntry);
    loadBestScores();
  }
}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem('bestScores')) || [];
  scores.push(score);
  scores.sort((a, b) => a.time - b.time);
  if (scores.length > 10) scores.pop();
  localStorage.setItem('bestScores', JSON.stringify(scores));
}

function loadBestScores() {
  bestScoresList.innerHTML = '';
  const scores = JSON.parse(localStorage.getItem('bestScores')) || [];
  scores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.time} seg - ${score.date}`;
    bestScoresList.appendChild(li);
  });
}
