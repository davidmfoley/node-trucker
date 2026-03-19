import { ImportLocation, ImportInfo } from './types'

export interface ImportStatement {
  filePath: string
  importPath: string
  loc: ImportLocation
}

type FindImports = (contents: string, filePath: string) => ImportStatement[]
type ProcessImport = (statement: ImportStatement) => ImportInfo
type ImportFilter = (info: ImportInfo) => boolean

export const getFileImports =
  (
    findImports: FindImports,
    processImport: ProcessImport,
    importFilter: ImportFilter
  ) =>
  (contents: string, filePath: string) =>
    findImports(contents, filePath)
      .map(processImport)
      .filter((x) => !!x)
      .filter(importFilter)
