var fs = require('fs');
var path = require('path');

module.exports = getFilePathMapper;

function getFilePathMapper(from, to) {
  var toEndsWithSep = (to[to.length - 1] === path.sep);
  var toStat = (fs.existsSync(to) && fs.statSync(to));
  var toIsDirectory = (toStat && toStat.isDirectory());
  var toIsFile = (toStat && toStat.isFile());
  var toFilename = to;

  if (Array.isArray(from)) {
    if (toIsFile) {
      throw new Error('When multiple files match, destination can\'t be a file');
    }
    return arrayMoveCalculator;
  }

  var fromStat = fs.statSync(from);

  if (fromStat.isFile()) {
    toFilename = toIsDirectory ? path.join(to, path.basename(from)) : to;

    return fileCalculator;
  }

  if (fromStat.isDirectory()) {
    return directoryMoveCalculator;
  }

  return nothingToDo;

  function fileCalculator(fullPath) {
    if (path.normalize(fullPath) === from) return moveInfo(true, toFilename);

    return moveInfo(false, fullPath);
  }

  function arrayMoveCalculator(fullPath) {
    if (from.filter(function(x){ return x === fullPath;}).length) {
      return moveInfo(true, path.join(to, path.basename(fullPath)));
    }
    return moveInfo(false, fullPath);
  }

  function directoryMoveCalculator(fullPath) {
    var normalized = path.normalize(fullPath);
    var relativePath = path.relative(from, normalized);
    var dest = path.join(to, relativePath);

    var isMoved = relativePath[0] != '.';
    return isMoved ? moveInfo(true, dest) : moveInfo(false, normalized);
  }

  function nothingToDo(f) {
    return {isMoved:false, fullPath: f};
  }
}

function moveInfo(isMoved, fullPath) {
  var filePath = path.normalize(fullPath);
  return {
    isMoved: isMoved,
    fullPath: filePath,
    requirePath: requirePath(filePath)
  };
}
function requirePath(filePath) {
  var basename = path.basename(filePath);
  var req = filePath.substring(0,  filePath.length - path.extname(filePath).length);
  if (basename == 'index.js'  || basename == 'index.coffee') {
    return path.dirname(req);
  }
  return req;
}
