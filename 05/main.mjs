import * as fs from 'fs';

const parsePoint = s => s.trim().split(",").map(Number);

const parseSegment = s => s.split("->").map(parsePoint);

const isHorizontal = segment => segment[0][1] === segment[1][1];
const isVertical = segment => segment[0][0] === segment[1][0];
const isLine = segment =>  isVertical(segment) ||  isHorizontal(segment);

const toKey = a => a[0] + "," + a[1];
const eq = (p1,p2) => p1[0] === p2[0] && p1[1] === p2[1];

const minMax = segment => {
  const [a,b] = segment;
  return isHorizontal(segment) 
    ? (a[0] < b[0] ? segment : [b,a])
    : (a[1] < b[1] ? segment : [b,a]);
};

const allPointsInSegment = segment => {
  const incX = p => [1 + p[0], p[1]];
  const incY = p => [p[0], 1 + p[1]];
  const [a, b] = minMax(segment);
  const points = [];
  let f = isHorizontal(segment) ? incX : incY;
  let next = a;
  do {
    //console.log("next",next,"b",b);
    points.push(next);
    next = f(next);
  } while (!eq(next,b));
  points.push(b);
  return points;
};

const countPoints = (counts, p) => Object.assign(counts, { [p]: 1 + (counts[p] || 0) });
const countIntersections = (total, n) => n === 1 ? total : total + 1;

/*
const input = [
"0,9 -> 5,9",
"8,0 -> 0,8",
"9,4 -> 3,4",
"2,2 -> 2,1",
"7,0 -> 7,4",
"6,4 -> 2,0",
"0,9 -> 2,9",
"3,4 -> 1,4",
"0,0 -> 8,8",
"5,5 -> 8,2",
];
*/

const input = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);
const segments = input.map(parseSegment);
const lines = segments.filter(isLine);

const allPoints = lines
  .flatMap(allPointsInSegment)
  .map(toKey)
  .reduce(countPoints, {});

// have to break the chain here because objects don't have a .values() method
const solution = Object.values(allPoints).filter(n => n > 1).length;

console.log(solution);

