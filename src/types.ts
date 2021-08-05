export interface TruckerJob {
  quiet?: boolean
  ignore?: { base: string; patterns?: string[] }
  base: string
  moves: {
    from: string[]
    to: string
  }[]
  files: string[]
  dryRun: boolean
  info: boolean
  unused: boolean
  format: string
  tsconfigPath?: string
}

export type TruckerMoveJob = TruckerJob

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

export interface FileModification {
  from: string
  to: string
  requires: ChangedRequire[]
}
export interface ChangedRequire {
  filePath: string
  newPath: string
  loc: Location
  path: string
}

export type TruckerOptions = any
