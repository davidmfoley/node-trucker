import checkForErrors from './checkForErrors'
import printChanges from './printChanges'
import applyChanges from './applyChanges'
import { FileModification, TruckerMoveJob } from '../types'

export default function (isDryRun: boolean) {
  if (isDryRun) console.log('DRY RUN - no changes will be made.')

  var handler = isDryRun ? printChanges : applyChanges

  return function (job: TruckerMoveJob, changes: FileModification[]) {
    var errors = checkForErrors(changes)
    if (errors.length) {
      console.error(
        'Unable to continue! ' + errors.length + ' errors occurred:'
      )
      console.error(errors.join('\n'))
      return
    }
    handler(job, changes)
  }
}
