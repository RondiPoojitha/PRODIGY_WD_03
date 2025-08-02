const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const draws = document.getElementById('draws');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isGameActive = true;
let mode = 'computer';
let scores = { X: 0, O: 0, draw: 0 };

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function handleClick(index) {
  if (!isGameActive || gameState[index]) return;
  makeMove(index, currentPlayer);
  playSound(clickSound);
  if (checkWin(currentPlayer)) {
    highlightWinningCells(currentPlayer);
    statusText.textContent = `Player ${currentPlayer === 'X' ? '❌' : '⭕'} Wins!`;
    scores[currentPlayer]++;
    playSound(winSound);
    updateScoreboard();
    isGameActive = false;
  } else if (gameState.every(cell => cell)) {
    statusText.textContent = "It's a Draw!";
    scores.draw++;
    playSound(drawSound);
    updateScoreboard();
    isGameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer === 'X' ? '❌' : '⭕'}'s turn`;
    if (mode === 'ai' && currentPlayer === 'O') {
      setTimeout(aiMove, 500);
    }
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player === 'X' ? '❌' : '⭕';
  cells[index].classList.add(player);
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => gameState[i] === player)
  );
}

function highlightWinningCells(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const pattern of winPatterns) {
    if (pattern.every(i => gameState[i] === player)) {
      pattern.forEach(i => cells[i].classList.add('win'));
      break;
    }
  }
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  draws.textContent = scores.draw;
}

function aiMove() {
  const emptyCells = gameState.map((val, i) => val ? null : i).filter(i => i !== null);
  if (emptyCells.length === 0) return;
  const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  handleClick(index);
}

function resetGame() {
  gameState.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  currentPlayer = 'X';
  isGameActive = true;
  statusText.textContent = "Player ❌'s turn";
  if (mode === 'ai' && currentPlayer === 'O') aiMove();
}

cells.forEach((cell, index) => cell.addEventListener('click', () => handleClick(index)));
resetGame();
