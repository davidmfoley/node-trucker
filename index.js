var path = require('path');
var fileLocationCalculator = require('./lib/fileLocationCalculator');
var fileFinder = require('./lib/fileFinder');
var analyzer = require('./lib/sourceFileAnalyzer');
var moveCalculator = require('./lib/fileMoveCalculator');

module.exports = function(options) {
  var from = options._[0];
  var to = options._[1];
  var base = process.cwd();

  var locationCalculator = fileLocationCalculator(from, to);
  var files = fileFinder(base).map(analyzer);
  files = moveCalculator(files, locationCalculator);

  files.forEach(function(f) {
    if (f.from != f.to)
      console.log(path.relative(base, f.from), ' -> ',  path.relative(base, f.to));
    else
      console.log(path.relative(base, f.from));

    f.requires.forEach(function(r) {
      console.log("" + r.loc.line+ ":" + r.loc.start, r.path, ' -> ', r.newPath);
    });
    console.log('');
  });
};
