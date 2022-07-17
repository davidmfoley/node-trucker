import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { FileRequireInfo, RequireInfo } from '../analyzeFiles'
import { ChangedRequire } from '../types'

interface SourceFile {
  fullPath: string
  requires: RequireInfo[]
}

export default (
  f: SourceFile,
  getNewLocation: LocationCalculator
): ChangedRequire[] => {
  const changedRequires = []
  const newFileLocation = getNewLocation(f.fullPath)

  f.requires.forEach(function (r: FileRequireInfo) {
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
  })

  return changedRequires
}
