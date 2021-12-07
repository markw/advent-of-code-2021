import * as fs from 'fs';
//const positions = "16,1,2,0,4,2,7,1,2,14".split(",").map(Number);
const positions = fs.readFileSync("input.txt", "utf-8").split(",").map(Number);

const min = (a) => a.reduce((m,n) => m < n ? m : n);
const max = (a) => a.reduce((m,n) => m > n ? m : n);

const range = (min,max) => {
  const result = [];
  let n = min;
  do { result.push(n); } while (n++ < max);
  return result;
}

const distance = (a,b) => Math.abs(a-b);

const distancePart2 = (a,b) => {
  const dist = distance(a,b);
  // building an array and reducing it is too slow, so it's a loop instead
  let total = 0;
  let n = 0;
  while (++n <= dist) total += n;
  return total;
}

const fuelPart1 = positions => pos => positions.reduce((a,b)=> a + distance(pos,b), 0);

const fuelPart2 = positions => pos => positions.reduce((a,b)=> a + distancePart2(pos,b), 0);

const solve = (positions, f) => {
  const a = min(positions);
  const b = max(positions);
  const fuels = range(a,b).map(f(positions));
  return min(fuels);

};

console.log("part 1", solve(positions, fuelPart1));
console.log("part 2", solve(positions, fuelPart2));

