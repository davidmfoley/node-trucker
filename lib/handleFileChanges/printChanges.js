var path = require('path');
function printChanges(job, changes) {
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
