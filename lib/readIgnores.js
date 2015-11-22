var path = require('path');
var fs = require('fs');

module.exports = function readIgnores(base) {
  var current = base;

  while(shouldContinue(current)) {
    console.log(current);
    var gitignorePath = current + '/.gitignore';
    if (fs.existsSync(gitignorePath)) {
      return parseGitignore(gitignorePath);
    }
    current = path.normalize(current + '/..');
  }
};

function shouldContinue(current) {
  return current !== '/';
}

function parseGitignore(gitignorePath) {
  var text = fs.readFileSync(gitignorePath, 'utf-8');
  var lines = text.split('\n');
  return lines.map(trim).map(stripComment).filter(removeEmpties);
}

function trim(line) {
  return line.trim();
}

function stripComment(line) {
  if (line.indexOf('#') === 1) return;
  return line;
}

function removeEmpties(line) {
  return !!(line && line.length);
}
