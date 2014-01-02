var fs = require('fs');
var path = require('path');

module.exports = getFilePathMapper;

function getFilePathMapper(from, to) {
  var mappers = from.map(getMapper);

  if (isFile(to) && from.length > 1) {
    throw new Error('When multiple files match, destination can\'t be a file');
  }

  return function(fullPath) {
    var mapped = mappers.map(function(mapper){ return mapper(fullPath);});
    var matches = mapped.filter(function(x) {return x;});

    if (matches.length) return moveInfo(true, matches[0]);
    return moveInfo(false, fullPath);
  };

  function getMapper(f) {
    var mapper = isDirectory(f) ? directoryMapper : fileMapper;
    return mapper(f, to);
  }
}

function fileMapper(f, to) {
  var toFilename = isDirectory(to) ? path.join(to, path.basename(f)) : to;
  return function(fullPath) {
    return (path.normalize(fullPath) === f) && toFilename;
  }
}

function directoryMapper(f, to) {
  return function(fullPath) {
    var relative = path.relative(f, fullPath);
    return (relative[0] != '.') && path.join(to, relative);
  }
}

function isDirectory(f) {
  var stat = (fs.existsSync(f) && fs.statSync(f));
  return (stat && stat.isDirectory());
}

function isFile(f) {
  var stat = (fs.existsSync(f) && fs.statSync(f));
  return (stat && stat.isFile());
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
