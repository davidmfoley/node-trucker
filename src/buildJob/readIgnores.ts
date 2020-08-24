import path from 'path';
import fs from 'fs';

export default function readIgnores(base) {
  var current = base;

  while(shouldContinue(current)) {
    var gitignorePath = current + '/.gitignore';
    if (fs.existsSync(gitignorePath)) {
      return {
        base: current,
        patterns: parseGitignore(gitignorePath)
      };
    }
    current = path.normalize(current + '/..');
  }

  return {base: base, patterns: []};
};

function shouldContinue(current) {
  return path.parse(current).root !== path.normalize(current);
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
