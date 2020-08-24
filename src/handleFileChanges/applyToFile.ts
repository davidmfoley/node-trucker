import getLineEdits from './getLineEdits'
import editLine from './editLine'
import importedSourceFile from '../sourceFile'

function applyToFile(
  filePath,
  changedRequires,
  sourceFile = importedSourceFile
) {
  var lines = sourceFile.readLines(filePath)
  var updated = applyEdits(lines, changedRequires)
  sourceFile.writeLines(filePath, updated)
}

function applyEdits(lines, requires) {
  var lineNumber = 0
  var byLine = getLineEdits(requires)

  return lines.map(function (line) {
    var edited = editLine(line, byLine[lineNumber])
    lineNumber++
    return edited
  })
}

export default applyToFile
