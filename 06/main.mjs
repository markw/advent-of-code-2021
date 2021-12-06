import * as fs from 'fs';

const doTimes = (n,f) => { while (n-- > 0) f(); }

function solve(input, days) {
  const buckets = Array.from({length:9}).fill(0);
  input.forEach(n => buckets[n]++); 
  doTimes(days, () => {
    const newFish = buckets.shift();
    buckets[6] += newFish;
    buckets[8] = newFish;
  });
  return buckets.reduce((a,b) => a+b);
};

//const test = solve([3,4,3,1,2], 256);
//console.log(test === 26984457539);

const input = fs.readFileSync("input.txt", "utf-8").split(",").map(Number);

console.log("part 1", solve(input, 80));
console.log("part 2", solve(input, 256));
