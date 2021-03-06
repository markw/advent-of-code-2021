
/*
const input = [
"00100",
"11110",
"10110",
"10111",
"10101",
"01111",
"00111",
"11100",
"10000",
"11001",
"00010",
"01010"
];
*/

import * as fs from 'fs';
const input = fs.readFileSync("input.txt", "utf-8").split("\n").filter(s=>s);

const range = n => Array.from(Array(n).keys());

const hexToInt = s => parseInt(s,2);

function bitFrequencies(pos, input) {
  function tally(acc,ch) {
    const obj = (ch === "1") ? {"1":1+acc[1]} : {"0":1+acc[0]};
    return Object.assign(acc, obj);
  }
  return input.map(s=>s[pos]).reduce(tally,{"1":0,"0":0});
}

function gammaAndEpslion(acc, bits) {
  return bits[0] > bits[1] 
    ? { gamma: acc.gamma + "0", epsilon: acc.epsilon + "1" } 
    : { gamma: acc.gamma + "1", epsilon: acc.epsilon + "0" } 
}

const indices = range(input[0].length);
const { gamma, epsilon } = indices.map(i=>bitFrequencies(i,input)).reduce(gammaAndEpslion, {gamma:"", epsilon:""});
const part1 = hexToInt(gamma) * hexToInt(epsilon);

console.log("part1", part1);

function calcRating(input, f) {
  function calcRating0(remaining, pos) {
    if (remaining.length === 1) return hexToInt(remaining[0]);
    const freq = bitFrequencies(pos, remaining);
    return calcRating0(remaining.filter(s=>s[pos]===f(freq)), pos + 1);
  }
  return calcRating0(input, 0);
}

const calcOxygenRating = input => calcRating(input, freq => (freq[1] >= freq[0]) ? "1" : "0");
const calcCo2Rating    = input => calcRating(input, freq => (freq[1] >= freq[0]) ? "0" : "1");

const oxygenRating = calcOxygenRating(input);
const co2Rating = calcCo2Rating(input);
console.log("part2", oxygenRating * co2Rating);
