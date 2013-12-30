var fs = require('fs');
var path = require('path');

module.exports = function(from, to) {
  var stat = fs.statSync(from);
  var normalizedFrom = path.normalize(from);
  var normalizedTo = path.normalize(to);
  var toEndsWithSep = (normalizedTo[normalizedTo.length - 1] === path.sep);

  if (toEndsWithSep)
    normalizedTo += path.basename(from);

  if (stat.isFile()) {
    return fileMove;
  }

  if (stat.isDirectory()) {
    return directoryMove;
  }

  return function(f) {
    return {isMoved:false, fullPath: f};
  };

  function fileMove(fullPath) {
    if (path.normalize(fullPath) === normalizedFrom)
      return {
        isMoved: true,
        fullPath: normalizedTo
      };

    return {
      isMoved: false,
      fullPath: path.normalize(fullPath)
    };
  }

  function directoryMove(fullPath) {
    var normalized = path.normalize(fullPath);
    var relative = path.relative(normalizedFrom, normalized);

    if (!(/^\.\./.exec(relative))) {
      return {
        isMoved: true,
        fullPath: path.join(normalizedTo, path.relative(normalizedFrom, normalized))
      };
    }
    return {
      isMoved: false,
      fullPath: normalized
    };
  }
};
