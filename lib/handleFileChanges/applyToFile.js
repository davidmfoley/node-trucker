var getLineEdits = require('./getLineEdits');
var editLine = require('./editLine');

function applyToFile(filePath, changedRequires, sourceFile) {
  sourceFile = sourceFile || require('./sourceFile');

  var lines = sourceFile.readLines(filePath);
  var updated = applyEdits(lines, changedRequires);
  sourceFile.writeLines(filePath, updated);
}

function applyEdits(lines, requires) {
  var lineNumber = 0;
  var byLine = getLineEdits(requires);

  return lines.map(function(line) {
    var edited = editLine(line, byLine[lineNumber]);
    lineNumber++;
    return edited;
  });
}

module.exports = applyToFile;
