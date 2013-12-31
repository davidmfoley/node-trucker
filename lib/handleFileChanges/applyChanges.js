var path = require('path');
var mkdirp = require('mkdirp');

function applyChanges(job, changes) {
  var to = job.to;
  var toEndsWithPathSep = (/\/\\$/).exec(to);
  if (toEndsWithPathSep) {
    to += path.basename(job.from);
  }
  mkdirp.sync(path.dirname(to));

  fs.rename(job.from, to);

  changes.forEach(function(f) {
    applyToFile(f.to, f.requires);
  });
}

