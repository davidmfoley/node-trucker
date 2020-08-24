var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var applyToFile = require('./applyToFile');
var printChanges = require('./printChanges');

function applyChanges(job, changes) {
  var to;
  if (!job.quiet) printChanges(job, changes);
  var toIsDirectory = fs.existsSync(job.to) && fs.statSync(job.to).isDirectory();

  job.from.forEach(function(from) {
    var fromIsFile = fs.statSync(from).isFile();

    if (fromIsFile && toIsDirectory) {
      to = path.join(job.to, path.basename(from));
    } else {
      to = job.to;
    }

    mkdirp.sync(path.dirname(to));
    fs.renameSync(from, to);
  });

  changes.forEach(function(f) {
    applyToFile(f.to, f.requires);
  });

}

module.exports = applyChanges;
