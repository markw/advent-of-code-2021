import * as fs from 'fs';
const log = console.log;
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n").filter(s=>s).map(s=>s.split(''));; 
const sampleInput = readFile("sample.txt");
const puzzleInput = readFile("input.txt");

const mapCells = (grid, f) => grid.map(row=>row.map(f));

const range = n => [...Array.from({length:n}).keys()];

const last = a => a.slice(-1)[0];

const buildAdjacencyList = (risks, numRows, numCols) => index => {
  const isValid = ([r,c]) => 0 <= r && r < numRows && 0 <= c && c < numCols;
  const colNum = index % numCols;
  const rowNum = Math.floor(index / numRows);
  const toIndex = ([r,c]) => r * numRows + c;
  const down  =  [rowNum + 1, colNum];
  const up  =    [rowNum - 1, colNum];
  const right =  [rowNum, colNum + 1];
  const left =   [rowNum, colNum - 1];
  return [right,down,up,left].filter(isValid).map(toIndex).map(cell=>[cell,risks[cell]]);
}

// based on page 527 of Introduction to Algoritms by Cormen/Leiserson/Rivest
const dijkstra = (adjacencyList, sourceIndex) => {

  const priorityQueue = d => {
    const deleted = [];
    const q = {
      isNotEmpty: () => {
        return deleted.length < d.length;
      },
      extractMin: () => {
        let minDistance = Infinity;
        let minIndex = -1;
        /*
        d.forEach((distance, index) => {
          if (distance < minDistance && !deleted[index]) {
            minDistance = distance;
            minIndex = index;
          }
        });
        */
        // this is much faster than forEach ...sigh
        for (var index = 0; index < d.length; index++) {
          const distance = d[index];
          if (distance < minDistance && !deleted[index]) {
            minDistance = distance;
            minIndex = index;
          }
        }
        deleted[minIndex] = true;
        return minIndex;
      }
    }
    return q;
  };

  const relax = (u,v,w) => {
    if (d[v] > d[u] + w) {
      d[v] = d[u] + w;
    }
  };

  const d = Array.from({length: adjacencyList.length}, () => Infinity);
  d[sourceIndex] = 0;

  const Q = priorityQueue(d);

  while (Q.isNotEmpty()) {
    const u = Q.extractMin();
    const neighbors = adjacencyList[u];
    adjacencyList[u].forEach(neighbor => {
      const w = neighbor[1];
      const v = neighbor[0];
      relax(u, v, w);
    });
  };
  return d;
}

const solve = (input, builder) => {
  const risks = builder(input);
  const numRows = Math.sqrt(risks.length);
  const numCols = numRows;
  const adjacencies = range(risks.length).map(buildAdjacencyList(risks,numRows,numCols));
  return last(dijkstra(adjacencies, 0));
};

const buildRisksForPart1 = input => mapCells(input, Number).reduce((acc,a) => acc.concat(a), []);

const sample = solve(sampleInput, buildRisksForPart1);
log("sample", sample);

const part1 = solve(puzzleInput, buildRisksForPart1);
log("part1", part1);

const buildRisksForPart2 = input => {
  //log("input", input);
  const concat = (a,b) => a.concat(b);
  const inc = n => n === 9 ? 1 : n + 1;
  const incRow = a => a.map(inc);


  const makeSection = (section, n) => {
    if (section.length === n) return section;
    const tile = last(section);
    const next = tile.map(incRow);
    //log("next",next);
    return makeSection(section.concat([next]), n);
  };

  const makeSections = (seed, n) => {
    const makeSections0 = (sections) => {
      if (sections.length === n) return sections;
      const prev = last(sections);
      const next = makeSection([prev[1]], n);
      return makeSections0(sections.concat([next]));
    };
    const sections = [];
    const firstSection = makeSection([seed], n);
    return makeSections0(sections.concat([firstSection]));
  }

  const sectionLines = section => range(input.length).map(n=>section.map(t=>t[n])).flat(2);

  const tile0 = mapCells(input, Number);
  return makeSections(tile0, 5).flatMap(sectionLines);
};

const part2Sample = solve(sampleInput, buildRisksForPart2);
log("part2 sample", part2Sample);

const part2 = solve(puzzleInput, buildRisksForPart2);
log("part2", part2);



