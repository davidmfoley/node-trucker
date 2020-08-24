export interface TruckerJob {
  quiet?: boolean
  ignore?: { base: string; patterns?: string[] }
  base: string
  from: string[]
  to: string
  files: string[]
  dryRun: boolean
  info: boolean
  unused: boolean
  format: string
}

export type TruckerMoveJob = TruckerJob

export interface SourceFile {
  fullPath: string
  filetype: string
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
