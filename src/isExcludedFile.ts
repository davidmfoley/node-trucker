import ignore from 'ignore';

export default function isExcludedFile(ignoreBase, ignorePatterns) {
  var filter = ignore({ twoGlobstars: true })
    .addPattern(ignorePatterns)
    .createFilter();

  return function(path) {
    var relativeToBase = path.relative(ignoreBase, path);

    // don't exclude files above ignore file
    if (relativeToBase.indexOf('..') === 0) return true;

    return filter(relativeToBase);
  };
};
