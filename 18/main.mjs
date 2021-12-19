const log = console.log;

const assertEquals = (expected, actual, msg='Failure:') => {
  if (expected !== actual) {
    console.log("\x1b[31m%s\x1b[0m", `${msg} Expected ${expected}, got ${actual}`);
  }
};

const assertArrayEquals = (a, b, msg="Failure:") => {
  const expected = JSON.stringify(a);
  const actual = JSON.stringify(b);
  assertEquals(expected,actual,msg);
}


const addSnailFish = (x,y) => [x,y];

const a = addSnailFish([[[[4,3],4],4],[7,[[8,4],9]]], [1,1]);
assertArrayEquals([[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]], a);

const traverse = a => {
  const traverse0 = (accum, path, value) => {
    //log("traverse0",accum,path,value);
    if (Number.isFinite(value)) return accum.concat({value, path});
    if (!value) return accum;
    return traverse0(accum, path.concat(0), value[0]).concat(traverse0(accum, path.concat(1), value[1]));
  }
  return traverse0([], [], a);
};

const getValue = (a,path) => path ? path.reduce((acc,n)=>acc[n], a) : undefined;
const dropLast = a => a.slice(0,a.length-1);
const last = a => a.slice(-1)[0];

const setValue = (a,path,value) => {
  //log("setValue",path,value);
  if (!a || typeof(path) === "undefined") return;
  const parent = getValue(a,dropLast(path));
  //log("parent", parent);
  parent[last(path)] = value;
}

const explode = a => {
  const isNumber = x => Number.isFinite(x);
  const t = traverse(a);
  const i = t.findIndex(({path})=>path.length === 5);
  if (i < 0) return false;
  const x = t[i].value;
  const y = t[i+1].value;
  //log("t",t, "i", i, "t[i-1]", t[i-1],"x",x,"y",y);
  const nextToLeft = t[i-1];
  if (nextToLeft) {
    const leftValue = getValue(a,nextToLeft.path);
    setValue(a, nextToLeft.path, leftValue + x);
  }
  const nextToRight = t[i+2];
  if (nextToRight) {
    const rightValue = getValue(a,nextToRight.path);
    setValue(a, nextToRight.path, rightValue + y);
  }
  const xyParent = dropLast(t[i].path);
  setValue(a, xyParent, 0);
  return true;
}

const testExplode = (expected, input) => {
  explode(input);
  assertArrayEquals(expected, input);
}

testExplode( [[[[0,7],4],[7,[[8,4],9]]],[1,1]], [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]] );
testExplode( [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]], [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]);
testExplode( [[3,[2,[8,0]]],[9,[5,[7,0]]]], [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]);
testExplode( [[[[0,9],2],3],4], [[[[[9,8],1],2],3],4]);

const split = a => {
  const t = traverse(a);
  const needSplit = t.find(({value})=>value > 9);
  if (!needSplit) {
    //log("split", false);
    return false;
  }
  const x = Math.trunc(needSplit.value/2);
  const y = Math.round(needSplit.value/2);
  setValue(a, needSplit.path, [x,y]);
  return true;
};

const reduceSnailFish = a => { 
  while(explode(a) || split(a));
}

const example = addSnailFish( [[[[4,3],4],4],[7,[[8,4],9]]] , [1,1] );
reduceSnailFish(example);
assertArrayEquals([[[[0,7],4],[[7,8],[6,0]]],[8,1]], example);

const magnitude = a => {
  const x = 3 * (Number.isFinite(a[0]) ? a[0] : magnitude(a[0]));
  const y = 2 * (Number.isFinite(a[1]) ? a[1] : magnitude(a[1]));
  return x + y;
};

assertEquals(4140, magnitude([[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]));

// part 1

import * as fs from 'fs';
const readFile = name =>fs.readFileSync(name, "utf-8");
const puzzleInput = readFile("input.txt").split("\n").filter(s=>s).map(s=>JSON.parse(s));;

const part1 = magnitude(puzzleInput.reduce((a,b)=>{
  const sum = addSnailFish(a,b);
  reduceSnailFish(sum);
  return sum;
}));

log("part 1", part1);