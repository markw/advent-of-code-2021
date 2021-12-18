const log = console.log;

const hexToBinary = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111',
};

const stringToBinary = s => Array.from(s).map(ch=>hexToBinary[ch]).join("");

const parseBinary = s => Number.parseInt(s,2);

const parseLiteral = s => {
  //log("parseLiteral",s,"(",s.length,")");
  let consumed = 0;
  var buffer = "";
  let done = false;
  do {
    buffer += s.substr(1,4);
    done = s[0] === '0';
    s = s.substr(5);
    consumed += 5;
  }
  while (!done);
  return { versions: [], consumed, expression: [parseBinary(buffer)] };
}

const parseOperator = (s) => {
  //log("parseOperator",s,"(",s.length,")");
  const expression = [];
  if (s[0] === '0') {
    const lengthOfSubpackets = parseBinary(s.substring(1, 16));
    //log("len subs", lengthOfSubpackets);
    let remaining = s.substr(16);
    let versions = [];
    let subConsumed = 0;
    while (subConsumed < lengthOfSubpackets) {
      const result = parse(remaining);
      //log("sub result[x]", result);
      result.versions.forEach(v => versions.push(v));
      expression.push(result.expression);
      remaining = remaining.substr(result.consumed);
      subConsumed += result.consumed;
    }
    return { versions, consumed : subConsumed + 16, expression };
  }
  else {
    let consumed = 12;
    const numberOfSubpackets = parseBinary(s.substring(1, 12));
    let remaining = s.substr(consumed);
    let versions = [];
    //log("numberOfSubpackets",numberOfSubpackets); 
    for (let i=0; i<numberOfSubpackets; i++) {
      const result = parse(remaining);
      //log(`sub result [${i}]`, result);
      remaining = remaining.substr(result.consumed);
      consumed += result.consumed;
      result.versions.forEach(v => versions.push(v));
      expression.push(result.expression);
    }
    return { versions, consumed, expression };
  }
}

const parse = (s) => {
  //log("-->parse", s, "(",s.length,")");
  const version = parseBinary(s.substr(0,3));
  const versions = [version];
  const type = parseBinary(s.substr(3,3));
  //log("version", version, "type", type);
  const ops = ['+','*','min','max',,'gt','lt','=']
  const remaining = s.substr(6);
  if (type === 4) {
    const result = parseLiteral(remaining);
    result.consumed += 6;
    return { versions, consumed: result.consumed, expression: result.expression};
  }
  else {
    const op = ops[type];
    const expression = [op];
    const result =  parseOperator(remaining);
    result.consumed += 6;
    result.versions.forEach(v => versions.push(v));
    result.expression.forEach(e => expression.push(e));
    return {versions, consumed : result.consumed, expression};
  }
}

const versionSum = s => {
  const result = parse(stringToBinary(s));
  return result.versions.reduce((a,b)=>a+b);
}

const assertEquals = (expected, actual) => {
  console.assert(expected === actual, `Expected ${expected}, got ${actual}`);
};

assertEquals(16, versionSum("8A004A801A8002F478"));
assertEquals(12, versionSum("620080001611562C8802118E34"));
assertEquals(23, versionSum("C0015000016115A2E0802F182340"));
assertEquals(31, versionSum("A0016C880162017C3686B18A3D4780"));

import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8");
const puzzleInput = readFile("input.txt");

log("part 1", versionSum(puzzleInput));

// part 2 --------------------------------------------------
//
const evaluateExpression = s => {
  const result = parse(stringToBinary(s));
  //log("result", JSON.stringify(result));

  const evaluate = exp => {
    //log("evaluate",exp);
    if (Number.isFinite(exp)) return exp;
    const op = exp[0];
    if (Number.isFinite(op)) return op;
    
    if (op === '+') {
      return exp.slice(1).reduce((a,b)=>evaluate(a)+evaluate(b), 0);
    }
    if (op === '*') {
      return exp.slice(1).reduce((a,b)=>evaluate(a)*evaluate(b), 1);
    }
    if (op === 'min') {
      return Math.min.apply(null, exp.slice(1).map(evaluate));
    }
    if (op === 'max') {
      return Math.max.apply(null, exp.slice(1).map(evaluate));
    }
    if (op === 'gt') {
      return evaluate(exp[1]) > evaluate(exp[2]) ? 1 : 0;
    }
    if (op === 'lt') {
      return evaluate(exp[1]) < evaluate(exp[2]) ? 1 : 0;
    }
    if (op === '=') {
      return evaluate(exp[1]) === evaluate(exp[2]) ? 1 : 0;
    }
  };

  return evaluate(result.expression);
}

assertEquals(3,  evaluateExpression("C200B40A82"));
assertEquals(54, evaluateExpression("04005AC33890"));
assertEquals(7,  evaluateExpression("880086C3E88112"));
assertEquals(9,  evaluateExpression("CE00C43D881120"));
assertEquals(1,  evaluateExpression("D8005AC2A8F0"));
assertEquals(0,  evaluateExpression("F600BC2D8F"));
assertEquals(0,  evaluateExpression("9C005AC2F8F0"));
assertEquals(1,  evaluateExpression("9C0141080250320F1802104A08"));

const part2 = evaluateExpression(puzzleInput);
log("part 2", part2);
