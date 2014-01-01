var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var applyToFile = require('./applyToFile');
var printChanges = require('./printChanges');

function applyChanges(job, changes) {
  var to;
  var toIsDirectory = fs.existsSync(job.to) && fs.statSync(job.to).isDirectory();

  var froms = Array.isArray(job.from) ? job.from : [job.from];
  froms.forEach(function(from) {
    var fromIsFile = fs.statSync(from).isFile();

    if (fromIsFile && toIsDirectory) {
      to = path.join(job.to, path.basename(from));
    } else {
      to = job.to;
    }
    mkdirp.sync(path.dirname(to));
    console.log(from, to);
    fs.rename(from, to);
  });

  changes.forEach(function(f) {
    applyToFile(f.to, f.requires);
  });

  if (!job.quiet) printChanges(job, changes);
}

module.exports = applyChanges;
