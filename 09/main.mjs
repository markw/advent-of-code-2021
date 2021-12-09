import * as fs from 'fs';
const fileInput = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);

const sampleInput = [
  "2199943210",
  "3987894921",
  "9856789892",
  "8767896789",
  "9899965678",
];

const range = n => [...Array.from({length:n}).keys()];

const getPoint = (hmap,r,c) => {
  const row = hmap[r];
  return row ? row[c] : null;
};

const neighbors = (r, c) => {
  const up    = {r:r-1,c};
  const down  = {r:r+1,c};
  const left  = {r,c:c-1};
  const right = {r,c:c+1};
  return [up,down,left,right];
};

const isLowPoint = hmap => ({r,c}) => {
  const point = getPoint(hmap,r,c);
  return neighbors(r,c)
    .map(({r,c})=>getPoint(hmap,r,c))
    .filter(p=>p)
    .reduce((a,b)=>a && (point < b), true);
}

const lowPointLocations = (row,r,hmap) => {
  return range(row.length)
    .map(c=>({r,c}))
    .filter(isLowPoint(hmap));
};

const inc = n => Number(n) + 1;
const sum = (a,b)=> a + b;
const product = (a,b)=> a * b;

const part1 = fileInput
  .flatMap(lowPointLocations)
  .map(({r,c})=>getPoint(fileInput,r,c))
  .map(inc)
  .reduce(sum);

console.log("part 1 =", part1);

// -----------------------------------------------------
// part 2
// -----------------------------------------------------

const union = (s,t) => new Set([...s].concat([...t]));

const basin = hmap => (rc) => {

  const {r,c} = rc;
  const str = ({r,c}) => r + "," + c;
  const isValid = ({r,c}) => {
    const p = getPoint(hmap,r,c);
    return p && p !== "9";
  };
  const crawl = (rc, seen, deltas, index) => {
    const delta = deltas[index];
    //console.log("crawl seen", seen, "rc", rc, "delta", delta);
    if (!delta) { return seen; }

    const candidate = { r: rc.r + delta.r, c: rc.c + delta.c };
    const cstr = str(candidate);
    if (!seen.has(cstr) && isValid(candidate)) {
      seen.add(cstr);
      return union(crawl(candidate, seen, deltas, 0), crawl(rc, seen, deltas, index + 1));
    };
    return union(seen, crawl(rc, seen, deltas, index + 1));
  };

  const deltas = [{r:0,c:1}, {r:0,c:-1},{r:1, c:0}, {r:-1, c:0}];
  const init = new Set([str(rc)]);
  return crawl(rc, init, deltas, 0);
}

const part2 = fileInput
  .flatMap(lowPointLocations)
  .map(basin(fileInput))
  .map(s=>s.size)
  .sort((a,b)=>a-b)
  .slice(-3)
  .reduce(product, 1)

console.log("part 2 =", part2);
