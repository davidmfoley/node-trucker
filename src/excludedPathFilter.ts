import path from 'path';
import ignore from 'ignore';

type PathFilter = (path: string) => boolean

export default (ignoreBase: string, ignorePatterns: string[]): PathFilter => {
  var filter = ignore({ twoGlobstars: true })
    .addPattern(ignorePatterns)
    .createFilter();

  return (filepath: string) => {
    var relativeToBase = path.relative(ignoreBase, filepath);

    // don't exclude files above ignore file
    if (relativeToBase.indexOf('..') === 0) return true;

    return filter(relativeToBase);
  };
};
