var path = require('path');
module.exports = function(changes) {
  var fileMoves = changes.filter(isMove);
  var byDest = {};
  fileMoves.forEach(function(m) {
    byDest[m.to] = byDest[m.to] || [];
    byDest[m.to].push(m.from);
  });

  var conflicts = Object.keys(byDest).filter(function(dest) {
    return byDest[dest].length > 1;
  });

  return conflicts.map(function(dest) {
    return message(dest, byDest[dest]);
  });

  function message(destination, sources) {
    return 'multiple files would be moved to ' + relativePath(destination) + ': ' + sources.map(relativePath).join(', ');
  }

  function relativePath(f) {
    return path.relative(process.cwd(), f);
  }
}

function isMove(change) {
  return change.from != change.to;
}
