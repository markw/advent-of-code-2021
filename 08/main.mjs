import * as fs from 'fs';

const parseData = data => data.map(s=>s.split("|").map(s => s.trim().split(" ")));

const sampleData = [
"be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
"edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
"fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
"fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
"aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
"fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
"dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
"bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
"egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
"gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce",
];

const parsedSampleData = parseData(sampleData);

const fileInput = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);

const inputsAndOutputs = parseData(fileInput);

const part1 = inputsAndOutputs
  .flatMap(io=>io[1])
  .filter(s=>[2,3,4,7].includes(s.length));

console.log("part 1 =", part1.length);

// part 2 =========================================================

const sampleEntry = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf";
const sampleEntryInputs = sampleEntry.split("|")[0].trim().split(" ");
const sampleEntryOutputs = sampleEntry.split("|")[1].trim().split(" ");

const segments = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
];

const toSet = s => new Set(s);

const digits = segments.map(toSet);

const setsEqual = (a,b) => [...a].every(x=>b.has(x)) && [...b].every(x=>a.has(x));

const findSize = (a,n) => a.filter(x=>n===x.size);

const remove = (s,...es) => { es.forEach(e=>s.delete(e)); return s; }

const union = (a,b) => {
  const u = new Set(a);
  b.forEach(x=>u.add(x));
  return u;
}

const minus = (a,b) => new Set([...a].filter(x => !b.has(x)));

const intersection = (a,b) => new Set([...a].filter(x => b.has(x)));

const createCharMap = segments => {
  const sets = segments.map(toSet);

  const size2 = findSize(sets,2)[0];
  const size3 = findSize(sets,3)[0];
  const size4 = findSize(sets,4)[0];
  const size5 = findSize(sets,5);
  const size6 = findSize(sets,6);
  const size7 = findSize(sets,7)[0];

  const minus_3_2 = minus(size3, size2);
  const minus_7_6 = size6.map(a=>minus(size7,a));
  const minus_4_3 = minus(size4, size3);
  const minus_5_4 = size5.map(a=>minus(a,size4))

  const mapsToA = [...minus_3_2][0];

  const mapsToG = Array.from(minus_5_4.map(s=>remove(s,mapsToA)).reduce(intersection))[0];

  const mapsToE = Array.from(minus_5_4.map(s=>remove(s,mapsToA, mapsToG)).reduce(union))[0];

  const mapsToB = Array.from(minus(minus_4_3, minus_7_6.map(s=>remove(s,mapsToE)).reduce(union)))[0];

  const mapsToD = Array.from(remove(minus_4_3,mapsToB))[0];

  const mapsToC = Array.from(remove(minus_7_6.reduce(union), mapsToD, mapsToE))[0];

  const mapsToF = Array.from(remove(size7, mapsToA, mapsToB, mapsToC, mapsToD, mapsToE, mapsToG))[0];

  return {
    [mapsToA]: "a",
    [mapsToB]: "b",
    [mapsToC]: "c",
    [mapsToD]: "d",
    [mapsToE]: "e",
    [mapsToF]: "f",
    [mapsToG]: "g",
  };
};

const charMap = createCharMap(sampleEntryInputs);

const sum = (a,b) => a + b;
const str = sum;
const applyMapping = mapping => s => s.split("").map(ch=>mapping[ch]).reduce(str,"");
const lookupDigit = s => digits.findIndex(charSet=>setsEqual(toSet(s),charSet));

const solveOne = data => {
  const charMap = createCharMap(data.input);
  const chars =  data.output.map(applyMapping(charMap)).map(lookupDigit).reduce(str,"");
  return Number(chars);
};

const solve = data => data.map(x=>({input: x[0], output: x[1]})).map(solveOne).reduce(sum);

const part2Sample = solve(parsedSampleData);
//console.log("part 2 Sample =", part2Sample);

const part2 = solve(inputsAndOutputs);
console.log("part 2 =", part2);
