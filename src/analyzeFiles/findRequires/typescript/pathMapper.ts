import micromatch from 'micromatch'

import path from 'path'
import { RequireInfo, RequireLocation } from '../../../types'

interface PathMapperImport {
  importPath: string
  filePath: string
}

type MapperPaths = {
  [key: string]: string[]
}

export type PathMapper = (
  importInfo: PathMapperImport,
  loc: RequireLocation
) => RequireInfo

const buildMapper =
  (pattern: string, destinations: string[]) =>
  (im: PathMapperImport, loc: RequireLocation): RequireInfo | undefined => {
    const result = micromatch.capture(pattern.replace('*', '**'), im.importPath)

    if (result) {
      let relativePath = path.relative(
        path.dirname(im.filePath),
        destinations[0].replace('*', result[0])
      )

      if (!relativePath.startsWith('.')) relativePath = './' + relativePath
      return {
        kind: 'alias',
        text: im.importPath,
        relativePath: relativePath,
        loc,
      }
    }
    return undefined
  }

export const getPathMapper = ({
  paths,
}: {
  paths: MapperPaths
}): PathMapper => {
  const mappers = Object.entries(paths).map(([key, destinations]) =>
    buildMapper(key, destinations)
  )

  return (r, loc) => {
    for (const mapper of mappers) {
      const result = mapper(r, loc)
      if (result) return result
    }

    return {
      relativePath: r.importPath,
      kind: 'relative',
      text: r.importPath,
      loc,
    }
  }
}
