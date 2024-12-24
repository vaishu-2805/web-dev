const menu = document.getElementById('menu');
const game = document.getElementById('game');
const board = Array.from(document.querySelectorAll('.cell')); // Convert NodeList to Array
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const backToMenuButton = document.getElementById('back-to-menu');
const vsAIButton = document.getElementById('vs-ai');
const vsPlayerButton = document.getElementById('vs-player');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');

let currentPlayer = 'X';
let mode = 'AI'; // Oyun modu: 'AI' veya 'Player'
let difficulty = 'easy'; // Zorluk seviyesi: 'easy', 'medium', 'hard'
let scores = { X: 0, O: 0 };
let gameActive = true;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];

// Oyun tahtasını sıfırla
function resetBoard() {
  board.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  status.textContent = '';
  currentPlayer = 'X';
  gameActive = true;
}

// Skorları güncelle
function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

// Kazanan kontrolü
function checkWinner() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      board[a].textContent === currentPlayer &&
      board[b].textContent === currentPlayer &&
      board[c].textContent === currentPlayer
    ) {
      status.textContent = `${currentPlayer} wins!`;
      scores[currentPlayer]++;
      updateScores();
      gameActive = false;
      setTimeout(resetBoard, 1000);
      return true;
    }
  }
  if (isDraw()) {
    status.textContent = "It's a draw!";
    gameActive = false;
    setTimeout(resetBoard, 1000);
    return true;
  }
  return false;
}

// Beraberlik kontrolü
function isDraw() {
  return board.every(cell => cell.textContent !== '');
}

// Yapay zekanın hamlesi
function aiMove() {
  if (!gameActive) return;

  const emptyCells = board.filter(cell => cell.textContent === '');
  let targetCell;

  if (difficulty === 'hard') {
    targetCell = calculateBestMove();
  } else if (difficulty === 'medium' && Math.random() > 0.5) {
    targetCell = calculateBestMove();
  } else {
    targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  if (targetCell) {
    targetCell.textContent = 'O';
    targetCell.classList.add('taken');
    if (!checkWinner()) {
      currentPlayer = 'X';
    }
  }
}

// En iyi hamleyi hesapla (zor mod)
function calculateBestMove() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    const cells = [board[a], board[b], board[c]];
    const oCount = cells.filter(cell => cell.textContent === 'O').length;
    const emptyCount = cells.filter(cell => cell.textContent === '').length;
    if (oCount === 2 && emptyCount === 1) {
      return cells.find(cell => cell.textContent === '');
    }
  }

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    const cells = [board[a], board[b], board[c]];
    const xCount = cells.filter(cell => cell.textContent === 'X').length;
    const emptyCount = cells.filter(cell => cell.textContent === '').length;
    if (xCount === 2 && emptyCount === 1) {
      return cells.find(cell => cell.textContent === '');
    }
  }

  return board.filter(cell => cell.textContent === '')[0];
}

// Hücrelere tıklama olayını ekle
board.forEach(cell => {
  cell.addEventListener('click', () => {
    if (!cell.textContent && gameActive) {
      if (mode === 'Player' || (mode === 'AI' && currentPlayer === 'X')) {
        cell.textContent = currentPlayer;
        cell.classList.add('taken');
        if (!checkWinner()) {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          if (mode === 'AI' && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
          }
        }
      }
    }
  });
});

// Menüdeki butonlar
vsAIButton.addEventListener('click', () => {
  mode = 'AI';
  menu.classList.add('hidden');
  game.classList.remove('hidden');
});

vsPlayerButton.addEventListener('click', () => {
  mode = 'Player';
  menu.classList.add('hidden');
  game.classList.remove('hidden');
});

backToMenuButton.addEventListener('click', () => {
  resetBoard();
  menu.classList.remove('hidden');
  game.classList.add('hidden');
});

// Zorluk seçimi
difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    difficulty = button.dataset.difficulty;
    difficultyButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

// Skorları sıfırla butonu
restartButton.addEventListener('click', () => {
  scores = { X: 0, O: 0 };
  updateScores();
  resetBoard();
});
