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

  const priorityQueue = () => {
    const heap = [];

    const parent = n => Math.floor((n-1)/2);
    const left = n => n * 2 + 1;
    const right = n => n * 2 + 2;
    const weightOf = x => x ? x.weight : undefined;
    const indexOf = x => x ? x.index : undefined;

    const heapify = (n) => {
      if (heap.length < 2) return;
      const p = parent(n);
      const l = left(p);
      const r = right(p);
      var smallest = p;
      if (weightOf(heap[r]) < weightOf(heap[p])) smallest = r;
      if (weightOf(heap[l]) < weightOf(heap[smallest])) smallest = l;
      if (smallest !== p) {
        const temp = heap[p];
        heap[p] = heap[smallest];
        heap[smallest] = temp;
        heapify(p);
      }
      if (heap.hasOwnProperty("-1")) throw Error(JSON.stringify(heap['-1']));
    };

    return {
      depth: () => heap.length,
      isNotEmpty: () => !!heap.length,
      update: x => {
        const existingIndex = heap.findIndex(({index})=>index===x.index);
        if (existingIndex === -1) {
          const len = heap.length;
          heap[len] = x;
          heapify(len);
        }
        else {
          heap[existingIndex].weight = x.weight;
          heapify(existingIndex);
        }
      },
      extractMin: () => indexOf(heap.shift())
    };
  };

  const relax = (u,v,w) => {
    const weight = d[u] + w;
    const dv = d[v];
    if (dv > weight) {
      d[v] = weight;
      Q.update({index: v, weight });
    }
  };

  const d = Array.from({length: adjacencyList.length}, () => Infinity);
  d[sourceIndex] = 0;

  const Q = priorityQueue();
  Q.update({index:sourceIndex, weight: 0});

  while (Q.isNotEmpty()) {
    const u = Q.extractMin();
    //log("u",u);
    const neighbors = adjacencyList[u];
    adjacencyList[u].forEach(neighbor => {
      const w = neighbor[1];
      const v = neighbor[0];
      relax(u, v, w);
    });
    if (u === adjacencyList.length - 1) {
      return d;
    }
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
log("part1 sample", sample);

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
