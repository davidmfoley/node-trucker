import path from 'path'
import sourceFile from '../sourceFile'
import editLine from './editLine'
import getLineEdits from './getLineEdits'

function printChanges(job, changes) {
  const count = changes.reduce(function (x, y) {
    return y.requires.length + x
  }, 0)
  console.log(count + ' changes in ' + changes.length + ' files.')

  const base = job.base
  changes.forEach(function (f) {
    if (f.from !== f.to) {
      console.log(
        path.relative(base, f.from),
        ' -> ',
        path.relative(base, f.to)
      )
    } else {
      console.log(path.relative(base, f.from))
    }

    const byLine = getLineEdits(f.requires)

    const fileContents = sourceFile.readLines(f.from)

    Object.keys(byLine).forEach(function (lineNumber) {
      const original = fileContents[lineNumber]
      const updated = editLine(original, byLine[lineNumber])
      const lineNumberPad = '' + lineNumber + ': '
      while (lineNumberPad.length < 3) {
        lineNumber = ' ' + lineNumber
      }

      console.log(lineNumberPad + '- ' + original)
      console.log(lineNumberPad + '+ ' + updated)
    })

    console.log('')
  })
}

export default printChanges
