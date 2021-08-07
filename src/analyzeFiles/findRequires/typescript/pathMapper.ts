import micromatch from 'micromatch'

import path from 'path'
import { FileRequireInfo } from '../../../types'
import { ImportStatement } from '../../getFileImports'
import { ImportResolver } from '../importResolver'

type MapperPaths = {
  [key: string]: string[]
}

export type PathMapper = (im: ImportStatement) => FileRequireInfo | undefined

const buildMapper =
  (pattern: string, destinations: string[], resolver: ImportResolver) =>
  (im: ImportStatement): FileRequireInfo | undefined => {
    const result = micromatch.capture(pattern.replace('*', '**'), im.importPath)

    if (result) {
      for (let destination of destinations) {
        const fullImportPath = destination.replace('*', result[0])
        const fullPath = resolver.absolute(fullImportPath)
        if (!fullPath) return undefined

        let relativePath = path.relative(
          path.dirname(im.filePath),
          fullImportPath
        )

        if (!relativePath.startsWith('.')) relativePath = './' + relativePath
        return {
          kind: 'alias',
          text: im.importPath,
          relativePath,
          fullPath,
          filePath: im.filePath,
          loc: im.loc,
        }
      }
    }
    return undefined
  }

export const getPathMapper = (
  {
    paths,
  }: {
    paths: MapperPaths
  },
  resolver: ImportResolver
): PathMapper => {
  const mappers = Object.entries(paths).map(([key, destinations]) =>
    buildMapper(key, destinations, resolver)
  )

  return (im) => {
    for (const mapper of mappers) {
      const result = mapper(im)
      if (result) return result
    }

    const fullPath = resolver.relative(im.filePath, im.importPath)
    if (!fullPath) return undefined

    return {
      relativePath: im.importPath,
      kind: 'relative',
      text: im.importPath,
      filePath: im.filePath,
      fullPath,
      loc: im.loc,
    }
  }
}
