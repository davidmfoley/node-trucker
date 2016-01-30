var path = require('path');
var sourceFile = require('./sourceFile');
var editLine = require('./editLine');
var getLineEdits = require('./getLineEdits');

function printChanges(job, changes) {
  var count = changes.reduce(function(x,y) { return y.requires.length + x;}, 0);
  console.log(count + ' changes in ' + changes.length + ' files.');

  var base = job.base;
  changes.forEach(function(f) {
    if (f.from !== f.to) {
      console.log(path.relative(base, f.from), ' -> ',  path.relative(base, f.to));
    }
    else {
      console.log(path.relative(base, f.from));
    }

    var byLine = getLineEdits(f.requires);

    var fileContents = sourceFile.readLines(f.from);

    Object.keys(byLine).forEach(function(lineNumber) {
      var original = fileContents[lineNumber];
      var updated = editLine(original, byLine[lineNumber]);
      var lineNumberPad = '' + lineNumber + ': ';
      while(lineNumberPad.length < 3) { lineNumber = ' '+ lineNumber; }

      console.log(lineNumberPad + '- ' + original);
      console.log(lineNumberPad + '+ ' + updated);
    });

    console.log('');
  });
}

module.exports = printChanges;
