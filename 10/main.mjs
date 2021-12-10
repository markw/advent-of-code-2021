import * as fs from 'fs';
const puzzleInput = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);

const sampleInput = [
"[({(<(())[]>[[{[]{<()<>>",
"[(()[<>])]({[<{<<[]>>(",
"{([(<{}[<>[]}>{[]{[(<()>",
"(((({<>}<{<{<>}{[]{[]{}",
"[[<[([]))<([[{}[[()]]]",
"[{[{({}]{}}([{[{{{}}([]",
"{<[[]]>}<{[{[{[]{()[[[]",
"[<(<(<(<{}))><([]([]()",
"<{([([[(<>()){}]>(<<{{",
"<{([{{}}[<[[[<>{}]]]>[]]",
];

const startChars = new Set("[{<(");;

const pairs = {"(":")", "<":">", "{":"}","[":"]"};
const scores= {")":3, "]":57, "}":1197,">":25137};

const parseLine = line => {
  const handleChar = (acc,ch) => {
    if (acc.score > 0) return acc;
    if (startChars.has(ch)) {
      acc.stack.push(pairs[ch]);
      return acc;
    }
    if (ch !== acc.stack.pop()) {
      acc.score = scores[ch];
    }
    return acc;
  };
  return Array.from(line).reduce(handleChar, {score: 0, stack: []});
};

const part1 = lines => lines.map(parseLine).reduce((a,b)=>a+b.score,0);

//console.log("part 1 =", part1(sampleInput));
console.log("part 1 =", part1(puzzleInput));

const incomplete = ({ score }) => 0 === score;

const scoreToComplete = ({ stack })=> {
  const charScores = {")":1, "]":2, "}": 3, ">":4};
  const f = (acc, stack) => {
    const ch = stack.pop();
    return ch ? f(5 * acc + charScores[ch],stack) : acc;
  }
  return f(0, stack);
}

const middle = a => a.sort((a,b)=>a-b)[(a.length - 1)/ 2];

const part2 = lines => middle(lines.map(parseLine).filter(incomplete).map(scoreToComplete));

//console.log("part 2 =", part2(sampleInput));
console.log("part 2 =", part2(puzzleInput));
