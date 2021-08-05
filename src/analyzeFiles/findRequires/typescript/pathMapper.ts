import { TsConfig } from './tsConfig'
import micromatch from 'micromatch'

import path from 'path'
import { RequireKind } from '../../../types'

interface PathMapperImport {
  importPath: string
  filePath: string
}

interface PathMapperResult {
  relativePath: string
  kind: RequireKind
  text: string
}

export type PathMapper = (importInfo: PathMapperImport) => PathMapperResult

export const getPathMapper = ({ paths }: TsConfig): PathMapper => {
  const mappers = Object.entries(paths).map(([key, destinations]) => {
    return (im: PathMapperImport): PathMapperResult | undefined => {
      const result = micromatch.capture(key.replace('*', '**'), im.importPath)
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
        }
      }
      return undefined
    }
  })

  return (r) => {
    for (const mapper of mappers) {
      const result = mapper(r)
      if (result) return result
    }

    return { relativePath: r.importPath, kind: 'relative', text: r.importPath }
  }
}
