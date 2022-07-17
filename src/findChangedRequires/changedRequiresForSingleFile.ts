import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { FileRequireInfo } from '../analyzeFiles'

interface SourceFile {
  fullPath: string
  requires: FileRequireInfo[]
}

export interface ChangedRequire {
  filePath: string
  newPath: string
  loc: Location
  path: string
}

export default (
  f: SourceFile,
  getNewLocation: LocationCalculator
): ChangedRequire[] => {
  const changedRequires = []
  const newFileLocation = getNewLocation(f.fullPath)

  for (const r of f.requires) {
    const newRequireLocation = getNewLocation(r.filePath)

    if (newFileLocation.isMoved || newRequireLocation.isMoved) {
      const extname = path.extname(r.filePath)
      let newPath = path.relative(
        path.dirname(newFileLocation.fullPath),
        newRequireLocation.requirePath + extname
      )
      if (newPath[0] !== '.') newPath = './' + newPath

      const isFile = fileInfo.isFile(r.fullPath)
      if (!isFile) {
        newPath = newPath.replace(/\/index\.(js|jsx|coffee|ts|tsx|mjs)$/, '')
        newPath = newPath.replace(/\.(js|jsx|coffee|ts|tsx|mjs)$/, '')
      }

      newPath = newPath.replace(/\\/g, '/')

      if (newPath !== r.relativePath) {
        changedRequires.push({
          loc: r.loc,
          path: r.relativePath,
          newPath: newPath,
          fullPath: r.fullPath,
        })
      }
    }
  }

  return changedRequires
}
