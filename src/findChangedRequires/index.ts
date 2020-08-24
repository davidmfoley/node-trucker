import fileLocationCalculator from './fileLocationCalculator';
import findSourceFiles from '../findSourceFiles';
import moveCalculator from './fileMoveCalculator';
import { TruckerMoveJob, FileModification } from '../types';

function changedRequiresByFile(job: TruckerMoveJob): FileModification[] {
  var locationCalculator = fileLocationCalculator(job.from, job.to);

  var files = findSourceFiles(job);

  return moveCalculator(files, locationCalculator);
}

export default changedRequiresByFile;
