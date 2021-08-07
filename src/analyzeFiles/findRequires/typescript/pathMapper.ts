import micromatch from 'micromatch'

import path from 'path'
import { RequireInfo } from '../../../types'
import { ImportStatement } from '../../getFileImports'

type MapperPaths = {
  [key: string]: string[]
}

export type PathMapper = (im: ImportStatement) => RequireInfo

const buildMapper =
  (pattern: string, destinations: string[]) =>
  (im: ImportStatement): RequireInfo | undefined => {
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
        loc: im.loc,
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

  return (im) => {
    for (const mapper of mappers) {
      const result = mapper(im)
      if (result) return result
    }

    return {
      relativePath: im.importPath,
      kind: 'relative',
      text: im.importPath,
      loc: im.loc,
    }
  }
}
