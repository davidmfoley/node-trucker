export interface SourceFile {
  fullPath: string
  filetype: string
}

export interface RequireLocation {
  line: number
  start: number
  length: number
}

export type NonAliasRequireKind = 'relative' | 'package'
export type AliasRequireKind = 'alias'

export type RequireInfo = {
  relativePath: string
  loc: RequireLocation
  text: string
} & (
  | {
      kind: NonAliasRequireKind
    }
  | {
      kind: AliasRequireKind
      mapping: { alias: string; destination: string }
    }
)

export type FileRequireInfo = RequireInfo & {
  fullPath: string
  filePath: string
}

export type SourceFileWithRequires = SourceFile & {
  requires: FileRequireInfo[]
}
