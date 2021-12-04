import * as fs from 'fs';

function parseCommand(s) {
  const tokens = s.split(" ");
  return { dir: tokens[0], n: Number(tokens[1]) };
}

const data = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s).map(parseCommand);

const result = data.reduce((acc, cmd) => {
  if (cmd.dir === 'forward') return { depth: acc.depth, horizontal: acc.horizontal + cmd.n };
  if (cmd.dir === 'up')      return { depth: acc.depth - cmd.n, horizontal: acc.horizontal };
  if (cmd.dir === 'down')    return { depth: acc.depth + cmd.n, horizontal: acc.horizontal };
}, { depth: 0, horizontal: 0 });

console.log("part1", result);
console.log("part1", result.horizontal * result.depth);

const part2 = data.reduce((acc, cmd) => {
  if (cmd.dir === 'forward') return Object.assign(acc, { depth: acc.depth + (acc.aim * cmd.n), horizontal: acc.horizontal + cmd.n });
  if (cmd.dir === 'up')      return Object.assign(acc, { aim: acc.aim - cmd.n });
  if (cmd.dir === 'down')    return Object.assign(acc, { aim: acc.aim + cmd.n });
}, { depth: 0, horizontal: 0, aim: 0 });

console.log("part2", part2);
console.log("part2", part2.horizontal * part2.depth);
