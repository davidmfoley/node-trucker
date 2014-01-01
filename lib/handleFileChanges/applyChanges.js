var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var applyToFile = require('./applyToFile');

function applyChanges(job, changes) {
  var to;
  var fromIsFile = fs.statSync(job.from).isFile();
  var toIsDirectory = fs.existsSync(job.to) && fs.statSync(job.to).isDirectory();

  if (fromIsFile && toIsDirectory) {
    to = path.join(job.to, path.basename(job.from));
  } else {
    to = job.to;
  }

  mkdirp.sync(path.dirname(to));

  fs.rename(job.from, to);

  changes.forEach(function(f) {
    applyToFile(f.to, f.requires);
  });
}

module.exports = applyChanges;
