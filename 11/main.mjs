import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n").filter(s=>s).map(s=>s.split(''));; 
const sampleInput = readFile("sample.txt");
const puzzleInput = readFile("input.txt");

const getCell = (grid, {r,c}) => {
  const row = grid[r];
  return row ? row[c] : null;
};

const setCell = (grid, {r,c}, value) => grid[r][c] = value;

const mapCells = (grid, f) => grid.map(row=>row.map(f));

const render = grid => grid.map(row=>row.join("")).join("\n");

const range = n => [...Array.from({length:n}).keys()];

const cartesian = (xs,ys) => {
  const result = [];
  for (let x of xs) { 
    for (let y of ys) { 
      result.push([x,y]);
    }
  };
  return result;
};

const locations = cartesian(range(10), range(10)).map(([r,c]) => ({r,c}));

const neighbors = (rc) => {
  const deltas = [
    {r:0,c:1},
    {r:0,c:-1},
    {r:1,c:1},
    {r:1,c:0},
    {r:1,c:-1},
    {r:-1,c:1},
    {r:-1,c:0},
    {r:-1,c:-1},
  ];
  return deltas.map(({r,c}) => ({r: rc.r + r, c: rc.c + c}));
};

const inc = n => n + 1;

const step = grid => {

  const flash = (count, grid) => {
    const flashLocation = locations.find(rc=>getCell(grid,rc) > 9);
    if (!flashLocation) return {count,grid};
    setCell(grid, flashLocation, 0);
    neighbors(flashLocation).forEach(rc=>{
      const level = getCell(grid, rc);
      if (level > 0) {
        setCell(grid, rc, level + 1);
      }
    });
    return flash(count + 1, grid);;
  };

  return flash(0, mapCells(grid,inc));
};

const solvePart1 = grid => {

  const doNextStep = (acc, _) => {
    const { count, grid } = step(acc.grid);
    return { count: acc.count + count, grid };
  };

  const init = {count: 0, grid}
  return range(100).reduce(doNextStep, init).count;
};

const grid = mapCells(puzzleInput, Number);

console.log("part 1=", solvePart1(grid));

const solvePart2 = grid => {

  const firstSimulFlashStep = (stepNum, grid) => {
    const isZero = rc => 0 === getCell(grid, rc);
    return locations.every(isZero) ? stepNum : firstSimulFlashStep(stepNum + 1, step(grid).grid);
  };

  return firstSimulFlashStep(0, grid);
};

console.log("part 2=", solvePart2(grid));
