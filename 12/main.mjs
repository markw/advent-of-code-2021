const smallInput = [ "start-A", "start-b", "A-c", "A-b", "b-d", "A-end", "b-end" ];
const sampleInput = [ "fs-end", "he-DX", "fs-he", "start-DX", "pj-DX", "end-zg", "zg-sl", "zg-pj", "pj-he", "RW-he", "fs-DX", "pj-RW", "zg-RW", "start-pj", "he-WI", "zg-he", "pj-fs", "start-RW"];
const puzzleInput = [ "TR-start", "xx-JT", "xx-TR", "hc-dd", "ab-JT", "hc-end", "dd-JT", "ab-dd", "TR-ab", "vh-xx", "hc-JT", "TR-vh", "xx-start", "hc-ME", "vh-dd", "JT-bm", "end-ab", "dd-xx", "end-TR", "hc-TR", "start-vh"];

const input = puzzleInput;

const parseConnection = (acc,s) => {

  const put = (a,b) => {
    const entry = acc[a] || [];
    acc[a] = entry.concat(b);
  };

  const [a,b] = s.split("-");
  if (b !== 'start' && a !== 'end') {
    put(a,b);
  }
  if (a !== 'start' && b !== 'end') {
    put(b,a);
  }
  return acc;
};

const connections = input.reduce(parseConnection, {});

//console.log(connections);

const isSmall = ch => ch === ch.toLowerCase();

const last = a => a.slice(-1)[0];

const frequencies = a => {
  const f = (acc, ch) => {
    acc[ch] = 1 + (acc[ch] || 0);
    return acc;
  };
  return a.reduce(f, {});
};

const buildPaths = (paths, fIsIllegalPath) => {

  const addNextStep = path => {
    const prev = last(path);
    if (prev === 'end') return [path];
    return connections[prev].map(dest => {
      const newPath = path.concat(dest);
      return fIsIllegalPath(newPath) ? [] : newPath;
    });
  };

  if (paths.every(path=>last(path)==='end')) return paths;

  const newPaths = paths.flatMap(addNextStep).filter(a=>a.length);
  return buildPaths(newPaths, fIsIllegalPath);
};

const isIllegalPath_Part1 = path => {
  const smallCaves = path.filter(isSmall);
  return Object.values(frequencies(smallCaves)).filter(n=> n > 1).length > 0;;
};

const isIllegalPath_Part2 = path => {
  const smallCaves = path.filter(isSmall);
  const freqs = Object.values(frequencies(smallCaves));
  if (freqs.filter(n => n > 2).length) return true;
  return freqs.filter(n=> n === 2).length > 1;
};

const init = [['start']];

const part1 = buildPaths(init, isIllegalPath_Part1).length;
console.log("part 1:", part1);

const part2 = buildPaths(init, isIllegalPath_Part2).length;
console.log("part 2:", part2);
