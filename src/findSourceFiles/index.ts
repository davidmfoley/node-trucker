import analyzeFiles from '../analyzeFiles';
import fileFinder from './findFiles';
import filterExcludedFiles from './filterExcludedFiles';
import { TruckerJob } from '../types';

const findSourceFiles = (job: TruckerJob)  => {
  let files = fileFinder(job.base);

  if (job.ignore && job.ignore.patterns && job.ignore.patterns.length) {
    files = filterExcludedFiles(job.ignore.base, job.ignore.patterns, files);
  }

  return analyzeFiles(job, files);
};

export default findSourceFiles
