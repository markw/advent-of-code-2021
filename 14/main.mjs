import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8").split("\n");
const sampleInput = readFile("sample.txt");
const puzzleInput = readFile("input.txt");

const parseRule = rule => {
  const tokens = rule.split(" ");
  const key = tokens[0];
  return { [key]:  tokens[2] };
}

const parsePairs = s => {
  const a = Array.from(s);
  const result = [];
  for (let i=0; i < a.length - 1; i++) {
    result.push(a[i] + a[i+1]);
  }
  return result;
}

const interleave = (a,b) => {
  const result = [];
  for (let i=0; i < a.length; i++) {
    result.push(a[i]);
    result.push(b[i]);
  }
  return result.join('');
}
const range = n => [...Array.from({length:n}).keys()];

const frequencies = x => {
  const a = Array.from(x);
  const f = (acc, ch) => {
    acc[ch] = 1 + (acc[ch] || 0);
    return acc;
  };
  return a.reduce(f, {});
};

const first = a => a[0];
const last = a => a.slice(-1)[0];

const increment = (obj, key, incr) => {
  const count = obj[key] || 0;
  obj[key] = count + incr;
  return obj;
};

const solve = (input, n) => {
  
  const doStep = (acc,_) => {
    const pairs = {};
    const chars = Object.assign({}, acc.chars);

    Object.keys(acc.pairs).forEach(pair => {
      const newChar = rules[pair];
      const newPair0 = pair[0] + newChar;
      const newPair1 = newChar + pair[1];

      const pairCount = acc.pairs[pair];
      increment(chars, newChar,  pairCount);
      increment(pairs, newPair0, pairCount);
      increment(pairs, newPair1, pairCount);
    });
    return { pairs, chars };
  };

  const rules = input.filter(s => s.includes("->")).map(parseRule).reduce((a,b) => Object.assign(a,b));
  const template = input[0];
  const init = { pairs : frequencies(parsePairs(template)), chars : frequencies(template)} ;
  const freqs = range(n).reduce(doStep,init).chars;
  const sorted = Object.values(freqs).sort((a,b)=>a-b);
  return last(sorted) - first(sorted);
};

const sample = solve(sampleInput, 10);
console.log("sample", sample);

const part1 = solve(puzzleInput, 10);
console.log("part 1", part1);

const part2 = solve(puzzleInput, 40);
console.log("part 2", part2);

