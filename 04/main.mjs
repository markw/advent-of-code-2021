import * as fs from 'fs';

const makeCell = s => ({value: s, marked: false});
const makeRow = s => s.split(" ").filter(s=>s).map(Number).map(makeCell);
const makeBoard = ss => ss.map(makeRow);

const makeBoards = input => {
  const makeBoards0 = (boards, n) => {
    if (!input[n]) return boards;
    const next = n + 5;
    const board = makeBoard(input.slice(n, next));
    return makeBoards0(boards.concat([board]), next);
  };
  return makeBoards0([], 1);
}

const row = (board, n) => board[n];
const col = (board, n) => board.map(row=>row[n]);

const mark = (board, n) => board.forEach(row=>{
  const index = row.findIndex(cell=>cell.value===n);
  if (index >= 0) row[index].marked = true;
});

const isWinner = board => {
  const allMarked = cells => cells.every(cell=>cell.marked);
  const hasWinningRow = board.some(allMarked);
  const hasWinningCol = [0,1,2,3,4].some(n=>allMarked(col(board,n)));
  return hasWinningRow || hasWinningCol;
};

const first = a => a[0];
const last = a => first(a.slice(-1));
const tail = a => a.slice(1);

const score = board => {
  const sum = (a,b) => a + b;
  const unmarkedCell = cell => !cell.marked;
  const cellValue = cell => cell.value;
  const unmarkedCellValues = row => row.filter(unmarkedCell).map(cellValue);
  return board.flatMap(unmarkedCellValues).reduce(sum);
};

const play = (numbers, boards) => {

  const play0 = (numbers, boards, winningBoards, winningScores) => {
    const hasAlreadyWon = index => winningBoards.includes(index);
    const numberToPlay =  first(numbers);
    boards.forEach((board, index) => {
      if (!hasAlreadyWon(index)) {
        mark(board, numberToPlay);
        if (isWinner(board)) {
          winningBoards.push(index);
          winningScores.push(numberToPlay * score(board));
        }
      }
    });
    return (winningBoards.length === boards.length)
      ? winningScores
      : play0(tail(numbers), boards, winningBoards, winningScores);
  };

  return play0(numbers, boards, [], []);
};

const input = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);
const numbersToDraw = first(input).split(",").filter(s=>s).map(Number);
const boards = makeBoards(input);

const winningScores = play(numbersToDraw, boards);
console.log("part 1 - first winning board score", first(winningScores));
console.log("part 2 - last winning board score", last(winningScores));
