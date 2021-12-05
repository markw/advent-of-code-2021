import * as fs from 'fs';

const parsePoint = s => s.trim().split(",").map(Number);

const parseSegment = s => s.split("->").map(parsePoint);

const isLineForPart1 = segment => {
  const isHorizontal = segment => segment[0][1] === segment[1][1];
  const isVertical = segment => segment[0][0] === segment[1][0];
  return isVertical(segment) ||  isHorizontal(segment);
};

const toKey = a => a[0] + "," + a[1];
const eq = (p1,p2) => p1[0] === p2[0] && p1[1] === p2[1];

const deltas = segment => {
  const delta = n =>  n === 0 ? 0 : (n < 0 ? -1 : 1);
  const diffX = segment[1][0] - segment[0][0];
  const diffY = segment[1][1] - segment[0][1];
  return [ delta(diffX), delta(diffY) ];
};

const allPointsInSegment = segment => {
  const last = a => a.slice(-1)[0];
  const [dx, dy] = deltas(segment);
  const nextPoint = p =>  [ p[0] + dx, p[1] + dy ];
  const [a,b] = segment;

  function generate(points) {
    const prev = last(points);
    return eq(b,prev) ? points : generate(points.concat([nextPoint(prev)]));
  }
  return generate([a]);
};

const countPoints = (counts, p) => Object.assign(counts, { [p]: 1 + (counts[p] || 0) });
const countIntersections = (total, n) => n === 1 ? total : total + 1;

const solve = (segments, segmentFilter) => {

  // need intermediate value here because objects don't have a .values() method
  const allPoints = segments.filter(segmentFilter)
    .flatMap(allPointsInSegment)
    .map(toKey)
    .reduce(countPoints, {});

  return Object.values(allPoints).filter(n => n > 1).length;
}

const input = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);
const segments = input.map(parseSegment);

console.log("part1", solve(segments, isLineForPart1));
console.log("part2", solve(segments, () => true));

