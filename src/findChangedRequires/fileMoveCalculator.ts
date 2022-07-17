import changedRequiresForSingleFile from './changedRequiresForSingleFile'
import { LocationCalculator } from './types'
import { SourceFileWithRequires } from '../analyzeFiles'
import { FileModification } from '../FileModification'

export default (
  fileInfos: SourceFileWithRequires[],
  getNewLocation: LocationCalculator
): FileModification[] => {
  const files: FileModification[] = []

  fileInfos.forEach(function (f) {
    const newFileLocation = getNewLocation(f.fullPath)
    const changedRequires = changedRequiresForSingleFile(f, getNewLocation)

    if (changedRequires.length || newFileLocation.isMoved) {
      files.push({
        from: f.fullPath,
        to: newFileLocation.fullPath,
        requires: changedRequires,
      })
    }
  })

  return files
}
