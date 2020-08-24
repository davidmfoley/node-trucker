import path from 'path'
import FileInfo from './fileInfo'
import { LocationCalculator } from './types'

export default (
  from: string[],
  to: string,
  fileInfo?: typeof FileInfo
): LocationCalculator => {
  fileInfo = fileInfo || FileInfo
  var mappers = from.map(getMapper)

  if (fileInfo.isFile(to) && from.length > 1) {
    throw new Error("When moving multiple files, destination can't be a file")
  }

  return function (fullPath) {
    var mapped = mappers.map(function (mapper) {
      return mapper(fullPath)
    })
    var matches = mapped.filter(function (x) {
      return x
    })

    if (matches.length) return moveInfo(true, matches[0])
    return moveInfo(false, fullPath)
  }

  function getMapper(f) {
    var mapper = fileInfo.isDirectory(f) ? directoryMapper : fileMapper
    return mapper(f, to, fileInfo)
  }
}

function fileMapper(f, to, fileInfo) {
  var toFilename = !fileInfo.isFile(to) ? path.join(to, path.basename(f)) : to
  return function (fullPath) {
    return path.normalize(fullPath) === f && toFilename
  }
}

function directoryMapper(f, to) {
  return function (fullPath) {
    var relative = path.relative(f, fullPath)
    return relative[0] !== '.' && path.join(to, relative)
  }
}

const requirePath = (filePath: string): string => {
  var basename = path.basename(filePath)
  var req = filePath.substring(
    0,
    filePath.length - path.extname(filePath).length
  )

  if (basename.split('.')[0] === 'index') {
    return path.dirname(req)
  }
  return req
}

const moveInfo = (isMoved: boolean, fullPath: string) => {
  const filePath = path.normalize(fullPath)
  return {
    isMoved,
    fullPath: filePath,
    requirePath: requirePath(filePath),
  }
}
