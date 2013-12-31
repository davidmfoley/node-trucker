function applyToFile(filePath, changedRequires, fsInject) {
  var fs = fsInject || require('fs');
  var contents = fs.readFileSync(filePath, {encoding: 'utf-8'});
  contents = applyEdits(contents, changedRequires);

  fs.writeFileSync(filePath, contents, {encoding: 'utf-8'});

}

function applyEdits(contents, requires) {
  var output = "";
  var byLine = groupByLine(requires);
  var lines = contents.split("\n");
  var lineNumber = 1;
  var lineEnding = "\n";

  lines.forEach(function(line) {
    if (lineNumber > 1) output += lineEnding;

    output += editLine(line, byLine[lineNumber]);

    lineNumber += 1;
  });
  return output;
}

function editLine(contents, edits) {
  if (!edits || edits.length === 0) {
    return contents;
  }
  var output = "";
  var position = 0;

  edits.forEach(function(edit) {
    var index = edit.loc.column - 1;
    output += contents.substring(position, index);
    output += edit.newPath;
    position = index + edit.loc.length;
  });
  output += contents.substring(position);

  return output;
}
function groupByLine(requires) {
  var byLine = {};
  requires.forEach(function(r) {
    var line = r.loc.line;
    byLine[line] = byLine[line] || [];
    byLine[line].push(r);
    byLine[line] = byLine[line].sort(function(a,b){
      return a.loc.column > b.loc.column;
    });
  });
  return byLine;
}

module.exports = applyToFile;
