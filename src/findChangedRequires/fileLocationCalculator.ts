import path from 'path'
import FileInfo from './fileInfo'
import { LocationCalculator } from './types'

export default (
  moves: {
    from: string[]
    to: string
  }[],
  fileInfo?: typeof FileInfo
): LocationCalculator => {
  fileInfo = fileInfo || FileInfo

  let mappers: ((path: string) => string | undefined)[] = []

  for (const { from, to } of moves) {
    const getMapper = (f: string) => {
      const mapper = fileInfo.isDirectory(f)
        ? directoryMapper
        : fileMapper(fileInfo.isFile)
      return mapper(f, to)
    }

    mappers = mappers.concat(from.map(getMapper))

    if (fileInfo.isFile(to) && from.length > 1) {
      throw new Error("When moving multiple files, destination can't be a file")
    }
  }

  return function (fullPath) {
    const mapped = mappers.map((mapper) => mapper(fullPath))
    const matches = mapped.filter((x) => !!x)

    if (matches.length) {
      return moveInfo(true, matches[0])
    }

    return moveInfo(false, fullPath)
  }
}

type Mapper = (f: string, to: string) => (fullPath: string) => string | null

const fileMapper =
  (isFile: (name: string) => boolean): Mapper =>
  (f, to) => {
    const toFilename = !isFile(to) ? path.join(to, path.basename(f)) : to
    return function (fullPath) {
      return (path.normalize(fullPath) === f && toFilename) || null
    }
  }

const directoryMapper: Mapper = (f, to) => {
  return function (fullPath) {
    let relative = path.relative(f, fullPath)
    if (to.endsWith(path.sep)) {
      relative = `${path.basename(f)}${path.sep}${relative}`
    }
    return (relative[0] !== '.' && path.join(to, relative)) || null
  }
}

const requirePath = (filePath: string): string => {
  const basename = path.basename(filePath)
  const req = filePath.substring(
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
