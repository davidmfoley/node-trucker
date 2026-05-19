import changedImportsForSingleFile from './changedImportsForSingleFile'
import { LocationCalculator } from './types'
import { SourceFileWithImports } from '../analyzeFiles'
import { FileModification } from '../FileModification'

export default (
  fileInfos: SourceFileWithImports[],
  getNewLocation: LocationCalculator
): FileModification[] => {
  const files: FileModification[] = []

  fileInfos.forEach(function (f) {
    const newFileLocation = getNewLocation(f.fullPath)
    const changedImports = changedImportsForSingleFile(f, getNewLocation)

    if (changedImports.length || newFileLocation.isMoved) {
      files.push({
        from: f.fullPath,
        to: newFileLocation.fullPath,
        requires: changedImports,
      })
    }
  })

  return files
}
