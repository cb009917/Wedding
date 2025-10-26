(async () => {
  try {
    // Resolve path relative to this file (ESM-friendly)
    const fileUrl = new URL('./src/utils/fuzzySearch.js', import.meta.url).href;
    const mod = await import(fileUrl);
    const { levenshteinDistance } = mod;

    const tests = [
      ['kitten', 'sitting', 3],
      ['john', 'jon', 1],
      ['flaw', 'lawn', 2],
      ['', 'abc', 3],
      ['same', 'same', 0],
    ];

    tests.forEach(([a, b, expected]) => {
      const got = levenshteinDistance(a, b);
      console.log(`${a} -> ${b}: expected ${expected}, got ${got}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
