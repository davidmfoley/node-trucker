import analyzeFiles from './analyzeFiles';
import fileFinder from './findFiles';
import filterExcludedFiles from './filterExcludedFiles';

export default function matchingRequires(job) {
  var files = fileFinder(job.base);

  if (job.ignore && job.ignore.patterns && job.ignore.patterns.length) {
    files = filterExcludedFiles(job.ignore.base, job.ignore.patterns, files);
  }

  return analyzeFiles(job, files);
};
