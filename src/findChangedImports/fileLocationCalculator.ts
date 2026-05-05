import path from 'path'
import FileInfo from './fileInfo'
import { LocationCalculator } from './types'

export default (
  moves: {
    from: string[]
    to: string
  }[],
  fileInfo = FileInfo
): LocationCalculator => {
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
    const match = mapped.find((x) => !!x)

    if (!match) {
      return {
        isMoved: false,
        basenameChanged: false,
        dirnameChanged: false,
        fullPath,
        requirePath: requirePath(path.normalize(fullPath)),
      }
    }

    return {
      isMoved: true,
      basenameChanged: path.basename(fullPath) != path.basename(match),
      dirnameChanged: path.dirname(fullPath) !== path.dirname(match),
      fullPath: match,
      requirePath: requirePath(match),
    }
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
    if (to.endsWith(path.sep) && !relative.startsWith('.')) {
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

  const dotDelimited = basename.split('.')

  // shorten index.ts but not index.server.ts
  if (dotDelimited.length === 2 && dotDelimited[0] === 'index') {
    return path.dirname(req)
  }
  return req
}
