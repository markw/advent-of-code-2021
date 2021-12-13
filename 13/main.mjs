import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n"); 

const sampleInput = [ "6,10", "0,14", "9,10", "0,3", "10,4", "4,11", "6,0", "6,12", "4,1", "0,13", "10,12", "3,4", "3,0", "8,4", "1,10", "2,14", "8,10", "9,0", "", "fold along y=7", "fold along x=5", ];

const isDot = s => s.includes(",");

const parseDot = s => s.split(",").map(Number);

const dotStr = dot => dot[0] + "," + dot[1];

const parseFold = s => {
  const tokens = s.split(" ")[2].split("=");
  return Array.of(tokens[0], Number(tokens[1]));
};

const parseInput = (acc, s) => {
  if (isDot(s)) {
    acc.dots.add(s);
  } else {
    acc.folds.push(parseFold(s));
  }
  return acc;
};

const input = readFile("input.txt").filter(s=>s).reduce(parseInput, {dots:new Set(), folds:[]});

const sampleDots = sampleInput.filter(isDot).map(parseDot);

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

const makeGrid = (numRows, numCols, dotPositions=[]) => {
  const grid = Array.from({length:numRows}).map(_ => Array.from({length:numCols}, () => " "));
  [...dotPositions].map(parseDot).forEach(([x,y]) => grid[y][x] = "#");
  return grid;
}

const render = grid => grid.map(row=>row.join("")).join("\n");

const maxX = setOfDots => Math.max(...[...setOfDots].map(parseDot).map(d=>d[0]))
const maxY = setOfDots => Math.max(...[...setOfDots].map(parseDot).map(d=>d[1]))

const part1 = foldPaper(input.dots, input.folds[0]);
console.log("part 1", part1.size);

const part2 = input.folds.reduce(foldPaper, input.dots);
const numRows =  1 + maxY(part2);
const numCols =  1 + maxX(part2);
const grid = makeGrid(numRows, numCols, part2);
console.log("part 2");
console.log(render(grid));
