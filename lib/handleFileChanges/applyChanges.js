var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var applyToFile = require('./applyToFile');

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

module.exports = applyChanges;
