var fs = require('fs');
var path = require('path');

module.exports = function(from, to) {
  var fromStat = fs.statSync(from);
  var normalizedFrom = path.normalize(from);
  var normalizedTo = path.normalize(to);
  var toEndsWithSep = (normalizedTo[normalizedTo.length - 1] === path.sep);

  if (fromStat.isFile()) {
    if (fs.existsSync(normalizedTo) && fs.statSync(normalizedTo).isDirectory()) {
      if (!toEndsWithSep) normalizedTo += path.sep;
      normalizedTo += path.basename(from);
    }

    return function(fullPath) {
      if (path.normalize(fullPath) === normalizedFrom) return moveInfo(true, normalizedTo);

      return moveInfo(false, fullPath);
    };
  }

  if (fromStat.isDirectory()) {

    return function(fullPath) {
      var normalized = path.normalize(fullPath);
      var relativePath = path.relative(normalizedFrom, normalized);
      var dest = path.join(normalizedTo, relativePath);

      var isMoved = relativePath[0] != '.';
      if (isMoved) {
        return moveInfo(true, dest);
      }
      return moveInfo(false, normalized);
    };
  }

  return function(f) {
    return {isMoved:false, fullPath: f};
  };
};

function moveInfo(isMoved, fullPath) {
  var filePath = path.normalize(fullPath);
  return {
    isMoved: isMoved,
    fullPath: filePath,
    requirePath: filePath.substring(0,  filePath.length - path.extname(filePath).length)
  };
}
