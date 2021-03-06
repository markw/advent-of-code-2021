import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n"); 

const sampleData = [ "6,10", "0,14", "9,10", "0,3", "10,4", "4,11", "6,0", "6,12", "4,1", "0,13", "10,12", "3,4", "3,0", "8,4", "1,10", "2,14", "8,10", "9,0", "", "fold along y=7", "fold along x=5", ];

const isDot = s => s.includes(",");

const parseDot = s => s.split(",").map(Number);

const dotStr = dot => dot[0] + "," + dot[1];

const parseFold = s => {
  const tokens = s.split(" ")[2].split("=");
  return Array.of(tokens[0], Number(tokens[1]));
};

const parseInputLine = (acc, s) => {
  if (isDot(s)) {
    acc.dots.add(s);
  } else {
    acc.folds.push(parseFold(s));
  }
  return acc;
};

const parseInput = input => input.filter(s=>s).reduce(parseInputLine, {dots:new Set(), folds:[]});

const foldUp = (y, dots) => {
  return dots.map(dot=> {
    if (dot[1] <= y) return dot;
    const diff = dot[1] - y;
    return [ dot[0], y - diff ];
  });
};

const foldLeft = (x, dots) => {
  return dots.map(dot=> {
    if (dot[0] <= x) return dot;
    const diff = dot[0] - x;
    return [ x - diff, dot[1] ];
  });
};

const foldPaper = (setOfDots, [foldDir, foldAt]) => {
  const dots = [...setOfDots].map(parseDot);
  const f = foldDir === "x" ? foldLeft : foldUp;
  const newDots = f(foldAt, dots).map(dotStr);
  return new Set(newDots);
};

const makeGrid = (dotPositions=[]) => {
  const numRows =  1 + maxY(dotPositions);
  const numCols =  1 + maxX(dotPositions);
  const makeRow = () => new Array(numCols).fill(" ");
  const grid = new Array(numRows).fill().map(makeRow);
  [...dotPositions].map(parseDot).forEach(([x,y]) => grid[y][x] = "#");
  return grid;
}

const render = grid => grid.map(row=>row.join("")).join("\n");

const max = (setOfDots, f) => Math.max(...[...setOfDots].map(parseDot).map(f));
const maxX = setOfDots => max(setOfDots, d=>d[0]);
const maxY = setOfDots => max(setOfDots, d=>d[1]);

const sampleInput = parseInput(sampleData);

const sample = foldPaper(sampleInput.dots, sampleInput.folds[0]);
console.log("sample", sample.size);

const puzzleInput = parseInput(readFile("input.txt"));

const part1 = foldPaper(puzzleInput.dots, puzzleInput.folds[0]);
console.log("part 1", part1.size);

const part2 = puzzleInput.folds.reduce(foldPaper, puzzleInput.dots);
console.log("part 2");
console.log(render(makeGrid(part2)));
