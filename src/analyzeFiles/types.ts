export interface SourceFile {
  fullPath: string
  filetype: string
}

export interface RequireLocation {
  line: number
  start: number
  length: number
}

export type RequireKind = 'relative' | 'alias' | 'package'

export interface RequireInfo {
  relativePath: string
  kind?: RequireKind
  loc: RequireLocation
  text: string
}

export type FileRequireInfo = RequireInfo & {
  fullPath: string
  filePath: string
}

export type SourceFileWithRequires = SourceFile & {
  requires: FileRequireInfo[]
}
