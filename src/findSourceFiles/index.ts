import analyzeFiles from '../analyzeFiles'
import fileFinder from './findFiles'
import filterExcludedFiles from './filterExcludedFiles'
import { TruckerJob } from '../TruckerJob'

const findSourceFiles = (job: TruckerJob) => {
  const files = fileFinder(job.base)

  const filtered = filterExcludedFiles(job)(files)

  return analyzeFiles(job, filtered)
}

export default findSourceFiles
