var path = require('path');
function printChanges(job, changes) {
  var count = changes.reduce(function(x,y) { return y.requires.length + x;}, 0);
  console.log(count + ' changes in ' + changes.length + ' files.');

  var base = job.base;
  changes.forEach(function(f) {
    if (f.from != f.to)
      console.log(path.relative(base, f.from), ' -> ',  path.relative(base, f.to));
    else
      console.log(path.relative(base, f.from));

    f.requires.forEach(function(r) {
      console.log("" + r.loc.line+ ":" + r.loc.start, r.path, ' -> ', r.newPath);
    });
    console.log('');
  });
}
module.exports = printChanges;
