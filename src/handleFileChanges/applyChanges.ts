import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import applyToFile from './applyToFile'
import printChanges from './printChanges'
import { TruckerMoveJob } from '../TruckerJob'
import { FileModification } from '../FileModification'

const applyChanges = (job: TruckerMoveJob, changes: FileModification[]) => {
  let to: string
  if (!job.quiet) printChanges(job, changes)

  for (const move of job.moves) {
    const toIsDirectory =
      fs.existsSync(move.to) && fs.statSync(move.to).isDirectory()

    for (const from of move.from) {
      const fromIsFile = fs.statSync(from).isFile()

      if (fromIsFile && toIsDirectory) {
        to = path.join(move.to, path.basename(from))
      } else {
        to = move.to
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
