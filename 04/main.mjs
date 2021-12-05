import * as fs from 'fs';
const input = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);

const makeCell = s => ({value: s, marked: false});

const makeRow = s => s.split(" ").filter(s=>s).map(Number).map(makeCell);

const makeBoard = ss => ss.map(makeRow);

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
const sum = (a,b) => a + b;

const score = board => {
  const unmarkedCellValues = row => row.filter(cell=>!cell.marked).map(cell=>cell.value);
  return board.flatMap(unmarkedCellValues).reduce(sum);
};

const makeBoards = input => {
  const makeBoards0 = (boards, n) => {
    if (!input[n]) return boards;
    const board = makeBoard(input.slice(n,n+5));
    return makeBoards0(boards.concat([board]), n+5);
  };
  return makeBoards0([], 1);
}

const play = (numbers, boards) => {
  const numberToPlay =  numbers[0];
  boards.forEach(board => mark(board, numberToPlay));
  const winningIndex = boards.findIndex(isWinner);
  if (winningIndex >= 0) {
    console.log("winner board",winningIndex);
    console.log("score",numberToPlay * score(boards[winningIndex]));
  }
  else play(numbers.slice(1), boards);
};

const numbersToDraw = input[0].split(",").filter(s=>s).map(Number);
const boards = makeBoards(input);
play(numbersToDraw, boards);
