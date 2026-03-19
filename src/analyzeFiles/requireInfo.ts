import { ImportInfo, ImportLocation } from './types'

export const relativeImport = (
  relativePath: string,
  loc: ImportLocation
): ImportInfo => ({
  relativePath,
  text: relativePath,
  kind: 'relative',
  loc,
})

export const aliasImport = (
  text: string,
  relativePath: string,
  loc: ImportLocation,
  mapping: { alias: string; destination: string }
): ImportInfo => ({
  relativePath,
  kind: 'alias',
  text,
  loc,
  mapping,
})
