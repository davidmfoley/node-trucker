import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import applyToFile from './applyToFile';
import printChanges from './printChanges';

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

export default applyChanges;
