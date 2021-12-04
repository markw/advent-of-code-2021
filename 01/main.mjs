import * as fs from 'fs';

const data = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s).map(Number);

function increased (acc,n) {
  if (!acc.prev) return { count: 0, prev: n };
  return acc.prev < n ? { count: acc.count + 1, prev: n } : { count: acc.count, prev: n};
}

const result = data.reduce(increased,{count : 0});

console.log("part1=", result);

function partition(a) {
  function partition0(acc, arr) {
    if (arr.length < 3) return acc;
    return partition0(acc.concat([arr.slice(0,3)]), arr.slice(1));
  }
  return partition0([], a);
}

const partitioned = partition(data);
const sum = (a,b)=>a+b;
const windowedMeasurements = partitioned.map(a=>a.reduce(sum,0));
const part2 = windowedMeasurements.reduce(increased,{count : 0});
console.log("part2=", part2);
