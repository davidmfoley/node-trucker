import { RequireInfo, RequireLocation } from '../types'

export const relativeImport = (
  relativePath: string,
  loc: RequireLocation
): RequireInfo => ({
  relativePath,
  text: relativePath,
  kind: 'relative',
  loc,
})

export const aliasImport = (
  text: string,
  relativePath: string,
  loc: RequireLocation
): RequireInfo => ({
  relativePath,
  kind: 'alias',
  text,
  loc,
})
