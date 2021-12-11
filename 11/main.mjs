import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n").filter(s=>s).map(s=>s.split(''));; 
const sampleInput = readFile("sample.txt");
const puzzleInput = readFile("input.txt");

const getCell = (grid, {r,c}) => {
  const row = grid[r];
  return row ? row[c] : null;
}

const setCell = (grid, {r,c}, value) => grid[r][c] = value;

const mapCells = (grid, f) => grid.map(row=>row.map(f));

const render = grid => grid.map(row=>row.join("")).join("\n");

const range = n => [...Array.from({length:n}).keys()];

const makeLocations = (numRows, numCols) => {
  const locations = [];
  for (let r of range(numRows)) { 
    for (let c of range(numRows)) { 
      locations.push({r,c});
    }
  };
  return locations;
}

const locations = makeLocations(10,10);

const neigborLocations = (grid, rc) => {
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
  return deltas.map(d=>({r:rc.r + d.r, c: rc.c + d.c}));
}

const inc = n => n + 1;

const step = grid => {

  const flash = (count, grid) => {
    const flashLocation = locations.find(rc=>getCell(grid,rc) > 9);
    //console.log("flashLocation", flashLocation);
    if (!flashLocation) return {count,grid};
    setCell(grid, flashLocation, 0);
    neigborLocations(grid, flashLocation).forEach(rc=>{
      const level = getCell(grid, rc);
      //console.log("rc",rc,"level",level);
      if (level && level >= 0) {
        //console.log("setting level", rc, level +1);
        setCell(grid, rc, level + 1);
      }
    });
    return flash(count + 1, grid);;
  };

  return flash(0, mapCells(grid,inc));
};

const solvePart1 = input => {
  const grid = mapCells(input, Number);
  const result = range(100).reduce((acc, n)=> {
    //console.log("n", n, "count", acc.count);
    const next = step(acc.grid);
    return { count: acc.count + next.count, grid: next.grid };
  }, {count: 0, grid});

  //console.log("flashes", result.count);
  // console.log(render(result.grid));
  return result.count;
};

console.log("part 1=", solvePart1(puzzleInput));

const solvePart2 = input => {
  const grid = mapCells(input, Number);
  const result = range(1000).reduce((acc, stepNum)=> {
    //console.log("step", stepNum, "count", acc.count);
    if (acc.simultaneousFlashStep) return acc;
    const next = step(acc.grid);
    const nextAcc = { count: acc.count + next.count, grid: next.grid };
    const isSimultaneousFlash = locations.every(rc => 0 === getCell(next.grid, rc));
    if (isSimultaneousFlash) {
      nextAcc.simultaneousFlashStep = stepNum + 1;
    }
    return nextAcc;
  }, {count: 0, grid});

  return result.simultaneousFlashStep;
};

console.log("part 2=", solvePart2(puzzleInput));
