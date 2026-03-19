export interface SourceFile {
  relativePath: string
  fullPath: string
  filetype: string
}

export interface ImportLocation {
  line: number
  start: number
  length: number
}

export type NonAliasImportKind = 'relative' | 'package'
export type AliasImportKind = 'alias'

export type ImportInfo = {
  relativePath: string
  loc: ImportLocation
  text: string
} & (
  | {
      kind: NonAliasImportKind
    }
  | {
      kind: AliasImportKind
      mapping: { alias: string; destination: string }
    }
)

export type FileImportInfo = ImportInfo & {
  fullPath: string
  filePath: string
}

export type SourceFileWithImports = SourceFile & {
  requires: FileImportInfo[]
}
