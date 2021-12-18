import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8");
const puzzleInput = readFile("input.txt");

const log = console.log;

const makeTargetArea = ([[minX, maxX], [minY, maxY]]) => ({
  includes: ([x,y]) => minX <= x && x <= maxX && minY <= y && y <= maxY,
  isAbove: ([x,y]) => y < minY,
  minX: minX,
  maxX: maxX,
  minY: minY,
  maxY: maxY
});

const parseTargetArea = s => {
  const coordinates = s.split(":")[1]
    .split(",")
    .map(s=>s.split("="))
    .map(a=>a[1].split("..").map(Number));

  return makeTargetArea(coordinates);
};

const target = parseTargetArea(puzzleInput);
const minYabsolute = Math.abs(target.minY);

const part1 = minYabsolute * (minYabsolute - 1) / 2;
log("part 1", part1);


const findInitialVelocityX = targetX => {
  const sumOfSequence = n => n * (n + 1) / 2;
  let x = 0;
  while (sumOfSequence(++x) < targetX);
  return x;
}

const trajectoryLandsInTargetArea = (velocity, target) => {

  const decay = ([x,y]) => {
    const newX = x === 0 ? 0 : x -1;
    return [ newX, y - 1];
  }

  const add = (a,b) => [a[0] + b[0], a[1] + b[1]];

  const generate = (pos, velocity) => {
    if (target.includes(pos)) return true;
    if (target.isAbove(pos)) return false;
    return generate(add(pos,velocity), decay(velocity));
  };

  return generate([0,0], velocity);
}

let count = 0;
for (let x = findInitialVelocityX(target.minX); x <= target.maxX; x++) {
  for (let y = target.minY; y < Math.abs(target.minY); y++) {
    if (trajectoryLandsInTargetArea([x,y], target)) {
      count++;
    }
  }
}

log("part 2", count);
