import checkForErrors from './checkForErrors'
import printChanges from './printChanges'
import applyChanges from './applyChanges'
import { TruckerMoveJob } from '../TruckerJob'
import { FileModification } from '../FileModification'

export default function (isDryRun: boolean) {
  if (isDryRun) console.log('DRY RUN - no changes will be made.')

  const handler = isDryRun ? printChanges : applyChanges

  return function (job: TruckerMoveJob, changes: FileModification[]) {
    const errors = checkForErrors(changes)
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
