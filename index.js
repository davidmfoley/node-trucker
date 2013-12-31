var path = require('path');
var changedRequiresByFile = require('./lib/changedRequiresByFile');

module.exports = function(options) {
  var base = process.cwd();
  var from = path.normalize(path.join(base, options._[0]));
  var to = path.normalize(path.join(base, options._[1]));

  changedRequiresByFile(from, to, base).forEach(function(f) {
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

