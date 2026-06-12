const SIZE = 4;
const TOTAL = SIZE * SIZE;

let tiles = [];
let moves = 0;
let seconds = 0;
let timerRef = null;
let won = false;

function initSolved() {
  return Array.from({ length: TOTAL }, (_, i) => i);
}

function isSolvable(arr) {
  let inversions = 0;
  for (let i = 0; i < TOTAL - 1; i++) {
    for (let j = i + 1; j < TOTAL; j++) {
      if (arr[i] && arr[j] && arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  const emptyRow = Math.floor(arr.indexOf(0) / SIZE);
  if (SIZE % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    return (emptyRow % 2 === 0) ? inversions % 2 === 1 : inversions % 2 === 0;
  }
}

function shuffle() {
  clearInterval(timerRef);
  moves = 0;
  seconds = 0;
  won = false;

  document.getElementById('moves').textContent = '0';
  document.getElementById('timer').textContent = '0:00';

  const msg = document.getElementById('msg');
  msg.className = '';
  msg.textContent = 'Klike sou pyes ki bò vid la pou deplase li!';

  let arr;
  do {
    arr = [...initSolved()].sort(() => Math.random() - 0.5);
  } while (!isSolvable(arr) || arr.every((v, i) => v === i));

  tiles = arr;
  render();

  timerRef = setInterval(() => {
    if (!won) {
      seconds++;
      document.getElementById('timer').textContent = formatTime(seconds);
    }
  }, 1000);
}

function formatTime(s) {
  const minutes = Math.floor(s / 60);
  const secs = s % 60;
  return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

function render() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  tiles.forEach((val, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile' + (val === 0 ? ' empty' : '');
    tile.textContent = val !== 0 ? val : '';

    if (val !== 0) {
      tile.addEventListener('click', () => tryMove(idx));
    }

    board.appendChild(tile);
  });
}

function tryMove(idx) {
  if (won) return;

  const emptyIdx = tiles.indexOf(0);
  const row = Math.floor(idx / SIZE);
  const col = idx % SIZE;
  const emptyRow = Math.floor(emptyIdx / SIZE);
  const emptyCol = emptyIdx % SIZE;

  const isAdjacent =
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow);

  if (isAdjacent) {
    tiles[emptyIdx] = tiles[idx];
    tiles[idx] = 0;

    moves++;
    document.getElementById('moves').textContent = moves;

    render();
    checkWin();
  }
}

function checkWin() {
  const solved = tiles.slice(0, TOTAL - 1).every((v, i) => v === i + 1) && tiles[TOTAL - 1] === 0;
  if (solved) {
    won = true;
    clearInterval(timerRef);

    const msg = document.getElementById('msg');
    msg.className = 'win';
    msg.textContent = '🎉 Bravo! Ou fini nan ' + moves + ' mouvman ak ' + formatTime(seconds) + '!';
  }
}

shuffle();
