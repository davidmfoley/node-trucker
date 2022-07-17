import { RequireLocation, RequireInfo } from './types'

export interface ImportStatement {
  filePath: string
  importPath: string
  loc: RequireLocation
}

type FindImports = (contents: string, filePath: string) => ImportStatement[]
type ProcessImport = (statement: ImportStatement) => RequireInfo
type ImportFilter = (info: RequireInfo) => boolean

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
