import fileLocationCalculator from './fileLocationCalculator'
import findSourceFiles from '../findSourceFiles'
import moveCalculator from './fileMoveCalculator'
import { TruckerMoveJob, FileModification } from '../types'

const changedRequiresByFile = (job: TruckerMoveJob): FileModification[] => {
  const locationCalculator = fileLocationCalculator(job.moves)

  const files = findSourceFiles(job)

  return moveCalculator(files, locationCalculator)
}

export default changedRequiresByFile
