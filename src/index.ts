import buildJob from './buildJob'
import printUnused from './printUnused'

import changedRequiresByFile from './findChangedRequires'
import handleFileChanges from './handleFileChanges'

import findSourceFiles from './findSourceFiles'
import printDependencies from './printDependencies'

export default function (options) {
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

function getAction(job) {
  if (job.unused) return showUnused
  if (job.info) return showInfo
  return moveFiles
}

function moveFiles(job) {
  const changes = changedRequiresByFile(job)
  const handler = handleFileChanges(job.dryRun)
  handler(job, changes)
}

function showInfo(job) {
  const requires = findSourceFiles(job)
  printDependencies(requires, job)
}

function showUnused(job) {
  const files = findSourceFiles(job)
  printUnused(job, files)
}
