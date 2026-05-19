import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import applyToFile from './applyToFile'
import printChanges from './printChanges'
import { TruckerMoveJob } from '../TruckerJob'
import { FileModification } from '../FileModification'

const applyChanges = (job: TruckerMoveJob, changes: FileModification[]) => {
  if (!job.quiet) printChanges(job, changes)

  for (const move of job.moves) {
    const toIsExistingDirectory =
      fs.existsSync(move.to) && fs.statSync(move.to).isDirectory()

    const toLooksLikeDirectory = move.to.endsWith('/') || move.to.endsWith('\\')

    for (const from of move.from) {
      let to = move.to
      const fromIsFile = fs.statSync(from).isFile()

      if (fromIsFile) {
        if (toIsExistingDirectory || toLooksLikeDirectory) {
          to = path.join(move.to, path.basename(from))
        }
      }

      mkdirp.sync(path.dirname(to))
      fs.renameSync(from, to)
    }
  }

  changes.forEach(function (f) {
    applyToFile(f.to, f.requires)
  })
}

export default applyChanges
