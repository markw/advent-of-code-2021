import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n").filter(s=>s).map(s=>s.split(''));
const log = console.log;
//const grid = readFile("sample.txt");
const grid = readFile("input.txt");

const render = g => g.map(row => row.join('')).join("\n");

const moveEast = (g,r) => {
  let moved = false;
  const row = g[r].map(x=>x);
  const nextEast = (r,c) => c >= row.length - 1 ? 0 : c + 1;
  for (let c=0; c<row.length; c++) {
    const next = nextEast(r,c);
    if (row[c] === '>' && row[next] === '.') {
      g[r][next] = '>';
      g[r][c] = '.';
      moved = true;
    }
  }
  return moved;
};

const moveDown = (g,c) => {
  let moved = false;
  const col = g.map(r=>r[c]);
  const nextDown = r => r >= g.length - 1 ? 0 : r + 1;
  for (let r=0; r<g.length; r++) {
    const next = nextDown(r);
    //log("r",r,"c",c,"next",next);
    if (col[r] === 'v' && col[next] === '.') {
      g[next][c] = 'v';
      g[r][c] = '.';
      moved = true;
    }
  }
  return moved;
}

const step = grid => {
  let moved = false;
  for (let r=0; r<grid.length; r++) {
    moved = moveEast(grid, r) || moved;
  }
  for (let c=0; c<grid[0].length; c++) {
    moved = moveDown(grid, c) || moved;
  }
  return moved;
};

let count = 0;
let done = false;
while (!done) {
  done = !step(grid);
  count++;
}
log("part 1 =", count);

