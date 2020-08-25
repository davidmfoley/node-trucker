import getLineEdits from './getLineEdits'
import editLine from './editLine'
import importedSourceFile from '../sourceFile'

function applyToFile(
  filePath,
  changedRequires,
  sourceFile = importedSourceFile
) {
  const lines = sourceFile.readLines(filePath)
  const encoding = sourceFile.getEncoding(filePath)
  var updated = applyEdits(lines, changedRequires)
  sourceFile.writeLines(filePath, updated, encoding)
}

function applyEdits(lines, requires) {
  let lineNumber = 0
  const byLine = getLineEdits(requires)

  return lines.map(function (line) {
    var edited = editLine(line, byLine[lineNumber])
    lineNumber++
    return edited
  })
}

export default applyToFile
