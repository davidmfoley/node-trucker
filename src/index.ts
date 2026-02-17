import buildJob from './buildJob'
import printUnused from './printUnused'

import changedRequiresByFile from './findChangedRequires'
import handleFileChanges from './handleFileChanges'

import findSourceFiles from './findSourceFiles'
import printDependencies from './printDependencies'
import { TruckerJob } from './TruckerJob'

export default function (options: unknown) {
  try {
    const job = buildJob(options)
    const action = getAction(job)
    action(job)
    return 0
  } catch (error) {
    console.error(error.message)
    return 1
  }
}

function getAction(job: TruckerJob) {
  if (job.unused) return showUnused
  if (job.info) return showInfo
  return moveFiles
}

function moveFiles(job: TruckerJob) {
  const changes = changedRequiresByFile(job)
  const handler = handleFileChanges(job.dryRun)
  handler(job, changes)
}

function showInfo(job: TruckerJob) {
  const files = findSourceFiles(job)
  printDependencies(files, job)
}

function showUnused(job: TruckerJob) {
  const files = findSourceFiles(job)
  printUnused(job, files)
}
